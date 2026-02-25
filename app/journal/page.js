"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import JournalForm from "@/components/JournalForm";
import JournalCard from "@/components/JournalCard";

export default function JournalPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchJournals();
        }
    }, [status]);

    const fetchJournals = async () => {
        try {
            const res = await fetch("/api/journals");
            if (!res.ok) {
                console.error("Fetch journals failed:", res.status);
                return;
            }
            const data = await res.json();
            setJournals(data.journals || []);
        } catch (err) {
            console.error("Failed to fetch journals:", err);
        } finally {
            setLoading(false);
        }
    };

    const addJournal = (newJournal) => {
        setJournals((prev) => [newJournal, ...prev]);
    };

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
        <div className="relative min-h-screen bg-[#060614] pt-32 pb-28 md:pb-12 overflow-x-hidden">
            <StarField />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
                <header className="mb-20 text-center space-y-4">
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

                    <div className="mt-24 space-y-12">
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

        </div>
    );
}
