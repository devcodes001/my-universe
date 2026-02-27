"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import JournalForm from "@/components/JournalForm";
import JournalCard from "@/components/JournalCard";
import HealingFlow from "@/components/HealingFlow";

export default function JournalPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHealingFlow, setShowHealingFlow] = useState(false);
    const [reflections, setReflections] = useState({});

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchJournals();
            fetchReflections();
        }
    }, [status]);

    const fetchJournals = async () => {
        try {
            const res = await fetch("/api/journals");
            if (!res.ok) return;
            const data = await res.json();
            setJournals(data.journals || []);
        } catch (err) {
            console.error("Failed to fetch journals:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReflections = async () => {
        try {
            const res = await fetch("/api/reflections");
            if (res.ok) {
                const data = await res.json();
                setReflections(data.reflections || {});
            }
        } catch (err) {
            console.error("Failed to fetch reflections:", err);
        }
    };

    const addJournal = (newJournal) => {
        setJournals((prev) => [newJournal, ...prev]);
    };

    const reflectionEntries = Object.entries(reflections).sort(
        ([a], [b]) => new Date(b) - new Date(a)
    );

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#060614] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#060614] pt-24 md:pt-32 pb-40 md:pb-12 overflow-x-hidden">
            <StarField />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
                <header className="mb-16 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                            CELESTIAL <br />
                            <span className="text-gradient">JOURNAL</span>
                        </h1>
                        <p className="text-xs text-white/30 uppercase tracking-[0.5em] font-black mt-6">
                            A shared cosmos of our innermost thoughts
                        </p>
                    </motion.div>
                </header>

                <div className="max-w-4xl mx-auto">
                    <JournalForm onAdd={addJournal} />

                    {/* Healing Flow Trigger */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setShowHealingFlow(true)}
                        className="w-full mt-6 py-5 rounded-[2rem] bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 text-center hover:from-red-500/20 hover:to-amber-500/20 transition-all group"
                    >
                        <span className="text-xs font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">
                            💔 Had a tough moment? →&nbsp;
                            <span className="text-red-400/80">Start Healing Flow</span>
                        </span>
                    </motion.button>

                    {/* Reflections Section */}
                    {reflectionEntries.length > 0 && (
                        <div className="mt-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-8 bg-amber-500/50 rounded-full" />
                                <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">
                                    GROWTH REFLECTIONS
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {reflectionEntries.map(([date, entries]) => (
                                    <motion.div
                                        key={date}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border-white/5"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="text-xl">🤝</span>
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                                                    {new Date(date).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {entries.map((entry) => (
                                                <div
                                                    key={entry._id}
                                                    className={`p-5 rounded-2xl border ${entry.isOwn
                                                        ? "bg-white/[0.03] border-white/10"
                                                        : "bg-purple-500/[0.03] border-purple-500/20"
                                                        }`}
                                                >
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/40">
                                                        {entry.isOwn ? "Your reflection" : entry.authorName}
                                                    </p>

                                                    {entry.isRevealed || entry.isOwn ? (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className="text-[9px] text-red-400/60 font-bold uppercase tracking-widest mb-1">What hurt</p>
                                                                <p className="text-sm text-white/70 italic">&ldquo;{entry.whatHurt}&rdquo;</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-amber-400/60 font-bold uppercase tracking-widest mb-1">What I learned</p>
                                                                <p className="text-sm text-white/70 italic">&ldquo;{entry.whatLearned}&rdquo;</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-emerald-400/60 font-bold uppercase tracking-widest mb-1">What I&apos;ll do differently</p>
                                                                <p className="text-sm text-white/70 italic">&ldquo;{entry.doDifferently}&rdquo;</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <span className="text-3xl block mb-3">🔒</span>
                                                            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
                                                                Reveals in {Math.max(0, Math.ceil((new Date(entry.visibleAfter) - new Date()) / (1000 * 60 * 60)))} hours
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Journal Entries */}
                    <div className="mt-16 space-y-12">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-8 bg-purple-500/50 rounded-full" />
                                <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">
                                    CHRONICLES OF US
                                </h2>
                            </div>
                            <div className="text-[10px] text-white/20 uppercase tracking-widest font-black">
                                {journals.length} ENTRIES IN OUR GALAXY
                            </div>
                        </div>

                        {journals.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 rounded-[3rem] glass-morphism border-white/5"
                            >
                                <span className="text-7xl block mb-8 grayscale opacity-40">📓</span>
                                <p className="text-xs text-white/20 uppercase tracking-[0.3em] font-black italic">
                                    The stars await your first shared whisper...
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {journals.map((journal, index) => (
                                        <JournalCard
                                            key={journal._id || index}
                                            journal={journal}
                                            index={index}
                                            isMe={journal.userId === session?.user?.id}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Healing Flow Modal */}
            <AnimatePresence>
                {showHealingFlow && (
                    <HealingFlow
                        onClose={() => setShowHealingFlow(false)}
                        onComplete={() => fetchReflections()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
