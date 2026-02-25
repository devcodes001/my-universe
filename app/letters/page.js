"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import LetterCard from "@/components/LetterCard";
import LetterForm from "@/components/LetterForm";

export default function LettersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [letters, setLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [tab, setTab] = useState("all");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchLetters();
        }
    }, [status]);

    const fetchLetters = async () => {
        try {
            const res = await fetch("/api/letters");
            if (!res.ok) {
                console.error("Fetch letters failed:", res.status);
                return;
            }
            const data = await res.json();
            setLetters(data.letters || []);
        } catch (err) {
            console.error("Failed to fetch letters:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = (newLetter) => {
        setLetters((prev) => [...prev, newLetter]);
    };

    const now = new Date();
    const filteredLetters =
        tab === "all"
            ? letters
            : tab === "opened"
                ? letters.filter((l) => new Date(l.openDate) <= now)
                : letters.filter((l) => new Date(l.openDate) > now);

    const sealedCount = letters.filter((l) => new Date(l.openDate) > now).length;
    const openedCount = letters.filter(
        (l) => new Date(l.openDate) <= now
    ).length;

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#060614] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="relative min-h-screen bg-[#060614] pt-20 pb-28 md:pb-12">
            <StarField />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16"
                >
                    <div>
                        <h1 className="text-6xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                            TIME <br />
                            <span className="text-gradient">CAPSULES</span>
                        </h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black mt-6">
                            Messages across the shared horizon
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-8 py-5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95"
                    >
                        + SEAL NEW LEGACY
                    </button>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-3 mb-12"
                >
                    {[
                        { value: "all", label: `ALL FREQUENCIES (${letters.length})` },
                        { value: "sealed", label: `🔒 SEALED (${sealedCount})` },
                        { value: "opened", label: `📖 UNLOCKED (${openedCount})` },
                    ].map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setTab(t.value)}
                            className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${tab === t.value
                                ? "bg-white/10 border border-white/20 text-white"
                                : "bg-white/[0.02] border border-white/5 text-white/30 hover:text-white/50 hover:bg-white/5"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}
                {filteredLetters.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 rounded-[3rem] glass-morphism border-white/5"
                    >
                        <span className="text-8xl block mb-10 grayscale opacity-20">💌</span>
                        <h3 className="text-xs text-white/20 uppercase tracking-[0.4em] font-black italic mb-8">
                            AWAITING YOUR FIRST SHARED LEGACY...
                        </h3>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-10 py-5 rounded-full border border-white/10 text-[10px] font-black text-white/40 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all uppercase tracking-[0.3em]"
                        >
                            BEGIN THE CHRONICLE
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredLetters.map((letter, index) => (
                            <LetterCard key={letter._id} letter={letter} index={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Write Letter Modal */}
            <AnimatePresence>
                {showForm && (
                    <LetterForm
                        onAdd={handleAdd}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
