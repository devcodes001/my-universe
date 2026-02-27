"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

export default function OurStoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/login");
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") fetchStats();
    }, [status]);

    const fetchStats = async () => {
        try {
            const [memRes, journRes, letRes, noteRes, streakRes] = await Promise.all([
                fetch("/api/memories"),
                fetch("/api/journals"),
                fetch("/api/letters"),
                fetch("/api/love-notes"),
                fetch("/api/streaks"),
            ]);

            const memories = memRes.ok ? (await memRes.json()).memories || [] : [];
            const journals = journRes.ok ? (await journRes.json()).journals || [] : [];
            const letters = letRes.ok ? (await letRes.json()).letters || [] : [];
            const notes = noteRes.ok ? (await noteRes.json()).notes || [] : [];
            const streaks = streakRes.ok ? await streakRes.json() : {};

            // Mood frequency
            const moodMap = {};
            journals.forEach((j) => {
                moodMap[j.mood] = (moodMap[j.mood] || 0) + 1;
            });
            const topMood = Object.entries(moodMap).sort((a, b) => b[1] - a[1])[0];

            // Busiest month
            const monthMap = {};
            [...memories, ...journals].forEach((item) => {
                const d = new Date(item.date || item.createdAt);
                const key = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                monthMap[key] = (monthMap[key] || 0) + 1;
            });
            const busiestMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0];

            // Word count
            const totalWords = journals.reduce((acc, j) => acc + (j.content || "").split(/\s+/).length, 0);

            // Opened letters
            const now = new Date();
            const openedLetters = letters.filter((l) => new Date(l.openDate) <= now).length;

            setStats({
                totalMemories: memories.length,
                totalJournals: journals.length,
                totalLetters: letters.length,
                totalNotes: notes.length,
                daysTogether: streaks.daysTogether || 1,
                journalStreak: streaks.journalStreak || 0,
                gratitudeStreak: streaks.gratitudeStreak || 0,
                peaceDays: streaks.daysSinceLastFight || 0,
                topMood: topMood ? { emoji: topMood[0], count: topMood[1] } : null,
                busiestMonth: busiestMonth ? { name: busiestMonth[0], count: busiestMonth[1] } : null,
                totalWords,
                openedLetters,
                totalEntries: memories.length + journals.length + letters.length + notes.length,
            });
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#060614] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!stats) return null;

    const bigStats = [
        { value: stats.daysTogether, label: "Days Together", icon: "💕", color: "from-pink-500/20 to-rose-500/20" },
        { value: stats.totalEntries, label: "Total Entries", icon: "✨", color: "from-purple-500/20 to-blue-500/20" },
        { value: stats.totalWords.toLocaleString(), label: "Words Written", icon: "📝", color: "from-cyan-500/20 to-teal-500/20" },
    ];

    const gridStats = [
        { value: stats.totalMemories, label: "Memories", icon: "💫" },
        { value: stats.totalJournals, label: "Journal Entries", icon: "📓" },
        { value: stats.totalLetters, label: "Time Capsules", icon: "💌" },
        { value: stats.totalNotes, label: "Love Notes", icon: "🏺" },
        { value: stats.openedLetters, label: "Letters Opened", icon: "📬" },
        { value: stats.peaceDays, label: "Peace Streak", icon: "☮️" },
        { value: stats.journalStreak, label: "Journal Streak", icon: "🔥" },
        { value: stats.gratitudeStreak, label: "Gratitude Streak", icon: "💛" },
    ];

    return (
        <div className="relative min-h-screen bg-[#060614] pt-24 md:pt-32 pb-40 md:pb-12 overflow-x-hidden">
            <StarField />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
                <header className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                            US IN <span className="text-gradient">NUMBERS</span>
                        </h1>
                        <p className="text-xs text-white/30 uppercase tracking-[0.5em] font-black mt-4">
                            Our love story, quantified ✨
                        </p>
                    </motion.div>
                </header>

                {/* Big 3 Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {bigStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className={`bg-gradient-to-br ${stat.color} rounded-[3rem] p-8 md:p-10 text-center border border-white/5 relative overflow-hidden`}
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-[60px] rounded-full" />
                            <span className="text-4xl block mb-3">{stat.icon}</span>
                            <p className="text-4xl md:text-5xl font-black text-white tabular-nums mb-2">{stat.value}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {gridStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className="glass-morphism rounded-2xl p-5 text-center border-white/5 hover:border-white/10 transition-all"
                        >
                            <span className="text-2xl block mb-2">{stat.icon}</span>
                            <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
                            <p className="text-[8px] text-white/30 uppercase tracking-[0.15em] font-bold mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.topMood && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="glass-morphism rounded-[2.5rem] p-8 border-white/5 text-center"
                        >
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black mb-4">Most Felt Mood</p>
                            <span className="text-6xl block mb-3">{stats.topMood.emoji}</span>
                            <p className="text-sm text-white/50 font-bold">{stats.topMood.count} times</p>
                        </motion.div>
                    )}

                    {stats.busiestMonth && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="glass-morphism rounded-[2.5rem] p-8 border-white/5 text-center"
                        >
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black mb-4">Busiest Month</p>
                            <p className="text-2xl font-black text-white mb-2">{stats.busiestMonth.name}</p>
                            <p className="text-sm text-white/50 font-bold">{stats.busiestMonth.count} entries</p>
                        </motion.div>
                    )}
                </div>

                {/* Anniversary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 rounded-[3rem] p-10 md:p-14 text-center border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.1)_0%,_transparent_70%)]" />
                    <div className="relative z-10">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="text-6xl mb-6 inline-block"
                        >
                            💝
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4">
                            {stats.daysTogether} Days, {stats.totalEntries} Entries, 1 Amazing Love Story
                        </h2>
                        <p className="text-sm text-white/40 italic max-w-md mx-auto">
                            Every word written, every memory captured, every note shared — it all tells the story of us.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black">
                                {session?.user?.name}&apos;s Universe
                            </p>
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
