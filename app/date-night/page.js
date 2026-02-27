"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import { useToast } from "@/components/ToastProvider";

const CATEGORIES = [
    { id: "home", label: "Home", icon: "🏠", color: "bg-pink-500/10 border-pink-500/20 text-pink-400" },
    { id: "outdoor", label: "Outdoor", icon: "🌿", color: "bg-green-500/10 border-green-500/20 text-green-400" },
    { id: "adventure", label: "Adventure", icon: "🎢", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
    { id: "fancy", label: "Fancy", icon: "🍷", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
    { id: "creative", label: "Creative", icon: "🎨", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
    { id: "spontaneous", label: "Spontaneous", icon: "⚡", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
];

export default function DateNightPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newIdea, setNewIdea] = useState({ title: "", category: "home" });
    const [spinning, setSpinning] = useState(false);
    const [picked, setPicked] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/login");
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") fetchIdeas();
    }, [status]);

    const fetchIdeas = async () => {
        try {
            const res = await fetch("/api/date-ideas");
            if (res.ok) {
                const data = await res.json();
                setIdeas(data.ideas || []);
            }
        } catch (err) {
            console.error("Failed to fetch ideas:", err);
        } finally {
            setLoading(false);
        }
    };

    const addIdea = async (e) => {
        e.preventDefault();
        if (!newIdea.title.trim()) return;
        setSubmitting(true);

        try {
            const res = await fetch("/api/date-ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newIdea),
            });

            if (res.ok) {
                const data = await res.json();
                setIdeas((prev) => [data.idea, ...prev]);
                setNewIdea({ title: "", category: "home" });
                setShowAdd(false);
                toast.success("Date idea added! 🎉");
            }
        } catch (err) {
            toast.error("Failed to add idea");
        } finally {
            setSubmitting(false);
        }
    };

    const spinWheel = () => {
        const unused = ideas.filter((i) => !i.isUsed);
        if (unused.length === 0) {
            toast.error("All ideas used! Add more or reset.");
            return;
        }

        setSpinning(true);
        setPicked(null);

        // Visual spinning effect
        let count = 0;
        const total = 15 + Math.floor(Math.random() * 10);
        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * unused.length);
            setPicked(unused[randomIdx]);
            count++;

            if (count >= total) {
                clearInterval(interval);
                const finalPick = unused[Math.floor(Math.random() * unused.length)];
                setPicked(finalPick);
                setSpinning(false);
                toast.love(`Tonight's plan: ${finalPick.title} 🎉`);
            }
        }, 100 + count * 15);
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#060614] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const unused = ideas.filter((i) => !i.isUsed);

    return (
        <div className="relative min-h-screen bg-[#060614] pt-24 md:pt-32 pb-40 md:pb-12 overflow-x-hidden">
            <StarField />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
                <header className="text-center mb-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                            DATE <span className="text-gradient">NIGHT</span>
                        </h1>
                        <p className="text-xs text-white/30 uppercase tracking-[0.5em] font-black mt-4">
                            Spin the wheel of love ✨
                        </p>
                    </motion.div>
                </header>

                {/* Spinner Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism rounded-[3rem] p-8 md:p-12 text-center mb-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5" />

                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            {picked ? (
                                <motion.div
                                    key={picked._id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="py-8"
                                >
                                    <span className="text-5xl block mb-4">
                                        {CATEGORIES.find((c) => c.id === picked.category)?.icon || "🌟"}
                                    </span>
                                    <h2 className={`text-2xl md:text-3xl font-black text-white tracking-tight mb-2 ${spinning ? "animate-pulse" : ""}`}>
                                        {picked.title}
                                    </h2>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                                        {CATEGORIES.find((c) => c.id === picked.category)?.label} • Added by {picked.addedBy}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
                                    <span className="text-5xl block mb-4">🎰</span>
                                    <p className="text-sm text-white/30 uppercase tracking-widest font-bold">
                                        {unused.length} ideas in the pool
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={spinWheel}
                                disabled={spinning || unused.length === 0}
                                className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-xl shadow-pink-500/20 disabled:opacity-30 transition-all"
                            >
                                {spinning ? "SPINNING..." : "🎲 SPIN"}
                            </motion.button>

                            <button
                                onClick={() => setShowAdd(true)}
                                className="px-8 py-4 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all"
                            >
                                + ADD IDEA
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Ideas Grid */}
                {ideas.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {ideas.map((idea, i) => {
                            const cat = CATEGORIES.find((c) => c.id === idea.category);
                            return (
                                <motion.div
                                    key={idea._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`glass-morphism rounded-2xl p-5 border-white/5 relative ${idea.isUsed ? "opacity-40" : ""}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-2xl">{cat?.icon || "🌟"}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cat?.color || "bg-white/5 border-white/10 text-white/40"}`}>
                                            {cat?.label}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-2">{idea.title}</h3>
                                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                        by {idea.addedBy} {idea.isUsed ? "• ✅ Done" : ""}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {ideas.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 glass-morphism rounded-[3rem] border-white/5">
                        <span className="text-6xl block mb-6 grayscale opacity-30">🎲</span>
                        <p className="text-xs text-white/20 uppercase tracking-widest font-black">
                            No date ideas yet — add some together!
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Add Idea Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowAdd(false)}
                    >
                        <motion.div
                            initial={{ y: 40 }}
                            animate={{ y: 0 }}
                            exit={{ y: 40 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#060614] border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl"
                        >
                            <h2 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic">
                                ADD <span className="text-gradient">IDEA</span>
                            </h2>

                            <form onSubmit={addIdea} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">Date Idea</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newIdea.title}
                                        onChange={(e) => setNewIdea((p) => ({ ...p, title: e.target.value }))}
                                        placeholder="Picnic under the stars..."
                                        className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/15 focus:outline-none focus:border-pink-500/50 transition-all text-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setNewIdea((p) => ({ ...p, category: cat.id }))}
                                                className={`py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${newIdea.category === cat.id
                                                    ? "bg-white text-black border-white"
                                                    : "bg-white/5 text-white/30 border-white/5 hover:bg-white/10"
                                                    }`}
                                            >
                                                {cat.icon} {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button type="button" onClick={() => setShowAdd(false)}
                                        className="py-3.5 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting}
                                        className="py-3.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50 transition-all">
                                        {submitting ? "Adding..." : "Add ✨"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
