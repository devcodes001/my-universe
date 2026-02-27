"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastProvider";

/**
 * LoveStreakWidget — Gamified love counters
 * Shows: days together (editable), days since fight, journal streak, gratitude streak
 */
export default function LoveStreakWidget() {
    const { data: session, update } = useSession();
    const toast = useToast();
    const [streaks, setStreaks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editDate, setEditDate] = useState("");

    useEffect(() => {
        fetchStreaks();
    }, []);

    const fetchStreaks = async () => {
        try {
            const res = await fetch("/api/streaks");
            if (res.ok) {
                const data = await res.json();
                setStreaks(data);
            }
        } catch (err) {
            console.error("Failed to fetch streaks:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDate = async (e) => {
        e.preventDefault();
        if (!editDate) return;

        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ togetherSince: editDate }),
            });

            if (res.ok) {
                await update({ togetherSince: editDate });
                setIsEditing(false);
                toast.love("Together since date updated! 💕");
                // Refetch streaks with new date
                fetchStreaks();
            } else {
                toast.error("Failed to update date");
            }
        } catch (err) {
            console.error("Failed to save together since:", err);
            toast.error("Something went wrong");
        }
    };

    if (loading || !streaks) return null;

    const counters = [
        {
            value: streaks.daysTogether,
            label: "Days Together",
            icon: "💕",
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            editable: true,
        },
        {
            value: streaks.daysSinceLastFight,
            label: "Peace Streak",
            icon: "☮️",
            color:
                streaks.daysSinceLastFight > 30
                    ? "text-emerald-400"
                    : streaks.daysSinceLastFight > 7
                        ? "text-amber-400"
                        : "text-red-400",
            bg:
                streaks.daysSinceLastFight > 30
                    ? "bg-emerald-500/10"
                    : streaks.daysSinceLastFight > 7
                        ? "bg-amber-500/10"
                        : "bg-red-500/10",
        },
        {
            value: streaks.journalStreak,
            label: "Journal Streak",
            icon: "📓",
            suffix: streaks.journalStreak > 0 ? "🔥" : "",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            value: streaks.gratitudeStreak,
            label: "Gratitude Streak",
            icon: "🏺",
            suffix: streaks.gratitudeStreak > 0 ? "🔥" : "",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border-white/10 relative overflow-hidden"
            >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/5 blur-[80px] rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🏆</span>
                            <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                                Love Streaks
                            </h3>
                        </div>
                        <button
                            onClick={() => {
                                const current = session?.user?.togetherSince;
                                setEditDate(current ? new Date(current).toISOString().split("T")[0] : "");
                                setIsEditing(true);
                            }}
                            className="text-[9px] font-black text-pink-400/60 hover:text-pink-400 uppercase tracking-widest transition-colors"
                        >
                            Edit ✏️
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {counters.map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i }}
                                className={`${c.bg} rounded-2xl p-3 md:p-4 border border-white/5 text-center group hover:border-white/10 transition-all`}
                            >
                                <div className="text-base md:text-lg mb-0.5">{c.icon}</div>
                                <p className={`text-xl md:text-3xl font-black ${c.color} tabular-nums`}>
                                    {c.value}
                                    {c.suffix && <span className="text-xs ml-1">{c.suffix}</span>}
                                </p>
                                <p className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold mt-0.5">
                                    {c.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Edit Together Since Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
                        onClick={() => setIsEditing(false)}
                    >
                        <motion.div
                            initial={{ y: 20, scale: 0.95, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 20, scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-[#0a0a25] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[60px]" />

                            <div className="relative z-10">
                                <div className="text-center mb-6">
                                    <span className="text-4xl block mb-3">💕</span>
                                    <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
                                        TOGETHER <span className="text-gradient">SINCE</span>
                                    </h2>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-2">
                                        When did your love story begin?
                                    </p>
                                </div>

                                <form onSubmit={handleSaveDate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">
                                            The Date It All Started
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={editDate}
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val.length > 10) return;
                                                setEditDate(val);
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-pink-500/50 font-black text-sm text-center"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="py-4 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-4 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Save 💕
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
