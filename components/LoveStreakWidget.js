"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * LoveStreakWidget — Gamified love counters
 * Shows: days together, days since fight, journal streak, gratitude streak
 */
export default function LoveStreakWidget() {
    const [streaks, setStreaks] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading || !streaks) return null;

    const counters = [
        {
            value: streaks.daysTogether,
            label: "Days Together",
            icon: "💕",
            color: "text-pink-400",
            bg: "bg-pink-500/10",
        },
        {
            value: streaks.daysSinceLastFight,
            label: "Peace Streak",
            icon: "☮️",
            // Green if > 30 days, amber if > 7, red if recent
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border-white/10 relative overflow-hidden"
        >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/5 blur-[80px] rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                        Love Streaks
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {counters.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                            className={`${c.bg} rounded-2xl p-4 border border-white/5 text-center group hover:border-white/10 transition-all`}
                        >
                            <div className="text-lg mb-1">{c.icon}</div>
                            <p className={`text-2xl md:text-3xl font-black ${c.color} tabular-nums`}>
                                {c.value}
                                {c.suffix && <span className="text-sm ml-1">{c.suffix}</span>}
                            </p>
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">
                                {c.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
