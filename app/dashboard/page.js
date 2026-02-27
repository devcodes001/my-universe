"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import StarField from "@/components/StarField";
import AnniversaryBanner from "@/components/AnniversaryBanner";
import CountdownWidget from "@/components/CountdownWidget";
import LoveJar from "@/components/LoveJar";
import OnThisDayWidget from "@/components/OnThisDayWidget";
import DailyPromptWidget from "@/components/DailyPromptWidget";
import LoveStreakWidget from "@/components/LoveStreakWidget";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ memories: 0, letters: 0 });
    const [recentMemories, setRecentMemories] = useState([]);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const fetchData = async () => {
        try {
            const [memRes, letRes, insightRes] = await Promise.all([
                fetch("/api/memories"),
                fetch("/api/letters"),
                fetch("/api/insights"),
            ]);

            if (memRes.ok) {
                const memData = await memRes.json();
                setRecentMemories((memData.memories || []).slice(0, 3));
                setStats((prev) => ({ ...prev, memories: memData.memories?.length || 0 }));
            }

            if (letRes.ok) {
                const letData = await letRes.json();
                const letters = letData.letters || [];
                const now = new Date();
                const upcoming = letters.find((l) => {
                    const openDate = new Date(l.openDate);
                    const diffDays = Math.ceil((openDate - now) / (1000 * 60 * 60 * 24));
                    return diffDays > 0 && diffDays <= 7;
                });
                setStats((prev) => ({
                    ...prev,
                    letters: letters.length,
                    upcoming,
                }));
            }

            if (insightRes.ok) {
                const insightData = await insightRes.json();
                setInsights(insightData);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#060614] flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                />
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">
                    Loading your universe...
                </p>
            </div>
        );
    }

    if (!session) return null;

    const togetherDate = session.user?.togetherSince || session.user?.createdAt || Date.now();
    const daysTogether = Math.floor(
        (new Date() - new Date(togetherDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;

    return (
        <div className="relative min-h-screen bg-[#060614] pt-24 md:pt-28 pb-40 md:pb-12 px-4 sm:px-6">
            <StarField />

            <div className="relative z-10 max-w-7xl mx-auto">
                <AnniversaryBanner />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter">
                            HELLO, <br />
                            <span className="text-gradient">
                                {(session.user?.name || "Explorer").toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-white/30 text-xs uppercase tracking-[0.4em] font-bold">
                            Exploring our private cosmos
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full md:w-[400px]"
                    >
                        <CountdownWidget />
                    </motion.div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-6 mb-12">

                    {/* Love Jar - Large Vertical */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-4 md:row-span-3 glass-morphism rounded-[3rem] flex items-center justify-center p-8 sm:p-10 text-center relative group overflow-hidden min-h-[320px] md:min-h-0"
                    >
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-pink-500/10 to-transparent opacity-50" />
                        <LoveJar />
                    </motion.div>

                    {/* Stats - Wide Small */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-5 md:row-span-1 glass-morphism rounded-[2.5rem] p-6 sm:p-8 flex items-center justify-around gap-4"
                    >
                        <div className="text-center">
                            <p className="text-3xl md:text-5xl font-black text-white">{stats.memories}</p>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Moments</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl md:text-5xl font-black text-white">{daysTogether}</p>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Days Together</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl md:text-5xl font-black text-white">{stats.letters}</p>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Letters</p>
                        </div>
                    </motion.div>

                    {/* Upcoming Letter Notification */}
                    {stats.upcoming && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="md:col-span-9 md:row-span-1 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-[2.5rem] border border-pink-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-pink-500/20 transition-all duration-700" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="text-4xl animate-bounce">💌</div>
                                <div>
                                    <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.4em]">OPENING SOON</h3>
                                    <p className="text-lg font-bold text-white tracking-tight mt-1">&quot;{stats.upcoming.title}&quot;</p>
                                </div>
                            </div>
                            <Link href="/letters" className="relative z-10 px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-500/10 hover:scale-105 transition-all">
                                VIEW CAPSULE
                            </Link>
                        </motion.div>
                    )}

                    {/* Quick Access */}
                    <div className="md:col-span-3 grid grid-cols-3 md:grid-cols-1 md:grid-rows-1 gap-6">
                        {[
                            { href: "/memories", icon: "💫", label: "Timeline" },
                            { href: "/journal", icon: "📓", label: "Moods" },
                            { href: "/letters", icon: "💌", label: "Archive" },
                        ].map((action, i) => (
                            <Link key={i} href={action.href} className="md:col-span-1 md:row-span-1">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-24 sm:h-full glass-morphism rounded-[2rem] flex items-center justify-center group"
                                >
                                    <span className="text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-500">{action.icon}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Memories */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-8 md:row-span-2 glass-morphism rounded-[3rem] p-8 sm:p-10 overflow-hidden relative"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                            <div>
                                <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">
                                    RECENT MEMORIES
                                </h2>
                                <p className="text-[11px] text-white/20 uppercase mt-1">Our latest celestial captures</p>
                            </div>
                            <Link href="/memories" className="px-6 py-3 rounded-full border border-white/10 text-[11px] font-black text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest text-center">
                                View Gallery
                            </Link>
                        </div>

                        {recentMemories.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl">
                                <span className="text-4xl opacity-20">✨</span>
                                <p className="text-xs text-white/20 uppercase font-black tracking-widest mt-4 italic">Awaiting your first moment</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {recentMemories.slice(0, 2).map((mem) => (
                                    <motion.div
                                        key={mem._id}
                                        whileHover={{ y: -5 }}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6 p-2">
                                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden flex-shrink-0 bg-[#0a0a1a] shadow-2xl relative">
                                                {mem.imageUrl ? (
                                                    <img src={mem.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">{mem.mood}</div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-bold text-white truncate tracking-tight">{mem.title}</h3>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[11px] text-white/30 font-black uppercase tracking-widest">
                                                        {new Date(mem.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </span>
                                                    <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                                                    <span className="text-[11px] text-purple-400 font-black uppercase tracking-widest">{mem.mood}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full" />
                    </motion.div>
                </div>

                {/* Love Streaks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <LoveStreakWidget />
                    {insights?.dailyPrompt && (
                        <DailyPromptWidget
                            prompt={insights.dailyPrompt}
                            onUsePrompt={() => router.push("/journal")}
                        />
                    )}
                </div>

                {/* Insights Row — On This Day */}
                {insights?.onThisDay?.hasContent && (
                    <div className="mb-12">
                        <OnThisDayWidget
                            memories={insights.onThisDay.memories}
                            journals={insights.onThisDay.journals}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
