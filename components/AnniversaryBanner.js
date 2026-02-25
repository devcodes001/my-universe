"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function AnniversaryBanner() {
    const { data: session } = useSession();
    const [isAnniversary, setIsAnniversary] = useState(false);
    const [years, setYears] = useState(0);

    useEffect(() => {
        if (session?.user?.anniversaryDate) {
            const anniv = new Date(session.user.anniversaryDate);
            const today = new Date();

            const isToday =
                anniv.getDate() === today.getDate() &&
                anniv.getMonth() === today.getMonth();

            if (isToday) {
                setIsAnniversary(true);
                setYears(today.getFullYear() - anniv.getFullYear());
            }
        }
    }, [session]);

    if (!isAnniversary) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-8 p-1 rounded-[2rem] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x"
        >
            <div className="bg-[#0a0a1a] rounded-[1.9rem] p-6 text-center">
                <span className="text-5xl block mb-4 animate-bounce">🎇</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                    Happy {years > 0 ? `${years} Year` : ""} Anniversary!
                </h2>
                <p className="text-white/60 mt-2 text-sm italic font-medium">
                    "Every second with you is a new favorite memory in our universe."
                </p>
                <div className="mt-6 flex justify-center gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-1 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
