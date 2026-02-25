"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function CountdownWidget() {
    const { data: session, update } = useSession();
    const [targetDate, setTargetDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editDate, setEditDate] = useState("");
    const [editName, setEditName] = useState("");
    const [milestoneName, setMilestoneName] = useState("Our Special Day");
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (session?.user?.anniversaryDate) {
            calculateNextOccurrence(new Date(session.user.anniversaryDate));
        } else {
            // Default to March 28 if none set
            const defaultDate = new Date();
            defaultDate.setMonth(2); // March is 2
            defaultDate.setDate(28);
            calculateNextOccurrence(defaultDate);
        }
        if (session?.user?.milestoneName) {
            setMilestoneName(session.user.milestoneName);
        }
    }, [session]);

    const calculateNextOccurrence = (baseDate) => {
        const now = new Date();
        let next = new Date(now.getFullYear(), baseDate.getMonth(), baseDate.getDate());

        if (next < now) {
            next.setFullYear(now.getFullYear() + 1);
        }
        setTargetDate(next);
    };

    useEffect(() => {
        if (!targetDate) return;

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                calculateNextOccurrence(targetDate); // Reset for next year
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    anniversaryDate: editDate || session?.user?.anniversaryDate,
                    milestoneName: editName
                }),
            });
            if (res.ok) {
                await update({
                    anniversaryDate: editDate || session?.user?.anniversaryDate,
                    milestoneName: editName
                });
                setMilestoneName(editName);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to update milestone", err);
        }
    };

    const stats = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
    ];

    return (
        <>
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-60">
                                COUNTDOWN TO
                            </h3>
                            <p className="text-white font-black text-sm uppercase tracking-widest italic text-gradient">
                                {milestoneName}
                            </p>
                        </div>
                        <span className="text-2xl group-hover:rotate-12 transition-transform duration-500">⏳</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <motion.div
                                    key={stat.value}
                                    initial={{ y: 5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tighter"
                                >
                                    {String(stat.value).padStart(2, '0')}
                                </motion.div>
                                <div className="text-[8px] uppercase tracking-widest text-white/30 font-black mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-white/40 italic font-medium">
                            {session?.user?.anniversaryDate ? "A cosmic appointment" : "Sync your stars"}
                        </span>
                        <button
                            onClick={() => {
                                setEditDate(session?.user?.anniversaryDate?.split('T')[0] || "");
                                setEditName(milestoneName);
                                setIsEditing(true);
                            }}
                            className="text-[10px] text-purple-400 font-bold uppercase tracking-widest hover:text-purple-300 cursor-pointer transition-colors"
                        >
                            Edit Milestone →
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-sm bg-[#0a0a1a] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px]" />

                            <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">SYNC <span className="text-gradient">STARS</span></h2>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-10">Define your next milestone</p>

                            <form onSubmit={handleSave} className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">Milestone Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editName}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="OUR NEXT ADVENTURE"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 font-black text-xs tracking-widest uppercase"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">Date of Destiny</label>
                                    <input
                                        type="date"
                                        required
                                        value={editDate}
                                        onFocus={(e) => e.target.select()}
                                        max="2100-12-31"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Basic safety for invalid dates or extreme years from manual typing
                                            if (val.length > 10) return;
                                            setEditDate(val);
                                        }}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 font-black text-xs"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-5 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 transition-all"
                                    >
                                        Calibrate
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    );
}
