"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

export default function LandingPage() {
    const { data: session } = useSession();

    return (
        <div className="relative min-h-screen bg-[#060614] overflow-hidden">
            <StarField />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                {/* Background Atmosphere */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl max-h-[600px] rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-[160px] opacity-50" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative text-center space-y-10"
                >
                    <motion.div
                        className="w-24 h-24 glass-morphism rounded-[2rem] mx-auto flex items-center justify-center border-white/10 group mb-4"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-5xl group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all">✨</span>
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white leading-none tracking-tighter uppercase italic">
                            OUR <br />
                            <span className="text-gradient">UNIVERSE</span>
                        </h1>
                        <p className="text-xs text-white/40 uppercase tracking-[0.6em] font-black max-w-lg mx-auto leading-loose">
                            A private digital sanctuary designed to <br className="hidden sm:block" /> immortalize your love story across dimensions.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
                    >
                        {session ? (
                            <Link href="/dashboard">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all"
                                >
                                    ENTER DASHBOARD
                                </motion.div>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/register">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-12 py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all"
                                    >
                                        INITIALIZE ORBIT
                                    </motion.div>
                                </Link>
                                <Link href="/auth/login">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-12 py-5 rounded-full glass-morphism border-white/10 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                                    >
                                        RECONNECT
                                    </motion.div>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32"
                >
                    {[
                        {
                            num: "01",
                            title: "CHRONICLES",
                            desc: "A timeless timeline of your most profound shared experiences.",
                        },
                        {
                            num: "02",
                            title: "ECHOES",
                            desc: "Sealed letters and voice memos reaching across the threads of time.",
                        },
                        {
                            num: "03",
                            title: "BUCKET LIST",
                            desc: "Co-authoring the dreams and ambitions that map your future.",
                        },
                    ].map((feature, i) => (
                        <div key={i} className="p-10 rounded-[3rem] glass-morphism border-white/5 relative group hover:border-white/20 transition-all duration-700">
                            <span className="text-xs font-black text-white/10 block mb-8 group-hover:text-white/40 transition-colors">
                                MODULE // {feature.num}
                            </span>
                            <h3 className="text-xl font-black text-white mb-4 tracking-widest uppercase italic group-hover:text-purple-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-white/30 leading-relaxed font-bold">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Cosmic Footer */}
                <div className="relative mt-20 mb-12 flex flex-col items-center gap-4">
                    <div className="w-12 h-px bg-white/10" />
                    <p className="text-[11px] text-white/10 uppercase tracking-[0.8em] font-black">
                        SECURED PRIVACY // ENCRYPTED AFFECTION
                    </p>
                </div>

            </div>
        </div>
    );
}
