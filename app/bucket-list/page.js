"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";

export default function BucketListPage() {
    const { data: session } = useSession();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", description: "" });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/bucket-list");
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newItem.title) return;
        try {
            const res = await fetch("/api/bucket-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            if (res.ok) {
                const data = await res.json();
                setItems([data.item, ...items]);
                setNewItem({ title: "", description: "" });
                setIsAdding(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComplete = async (id, currentStatus) => {
        try {
            const res = await fetch("/api/bucket-list", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isCompleted: !currentStatus }),
            });
            if (res.ok) {
                const data = await res.json();
                setItems(items.map(item => item._id === id ? data.item : item));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return null;

    const completedCount = items.filter(i => i.isCompleted).length;

    return (
        <div className="relative min-h-screen bg-[#060614] pt-32 pb-28 md:pb-12 px-4">
            <StarField />

            <div className="relative z-10 max-w-3xl mx-auto">
                <header className="mb-20 text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-28 h-28 glass-morphism rounded-[2.5rem] mx-auto flex items-center justify-center border-white/10 shadow-2xl relative group"
                    >
                        <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-6xl relative z-10">🌍</span>
                    </motion.div>

                    <div className="space-y-3">
                        <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tighter uppercase italic">
                            BUCKET <span className="text-gradient-cyan">LIST</span>
                        </h1>
                        <p className="text-[11px] text-white/30 font-black uppercase tracking-[0.4em]">
                            Mapping our constellation of dreams
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-6">
                        <div className="text-center px-10 py-5 glass-morphism rounded-[2rem] border-white/5 flex-1 max-w-[160px]">
                            <p className="text-4xl font-black text-white">{items.length}</p>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">DREAMS</p>
                        </div>
                        <div className="text-center px-10 py-5 glass-morphism rounded-[2rem] border-white/5 flex-1 max-w-[160px]">
                            <p className="text-4xl font-black text-white">{completedCount}</p>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">REALIZED</p>
                        </div>
                    </div>
                </header>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAdding(true)}
                    className="w-full py-8 mb-12 rounded-[2.5rem] glass-morphism border-dashed border-white/10 text-xs font-black uppercase tracking-[0.4em] text-white/40 hover:text-white hover:border-cyan-500/50 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-4 group"
                >
                    <span className="text-3xl group-hover:rotate-90 transition-transform duration-500">+</span>
                    New Ambition
                </motion.button>


                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {items.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 glass-morphism rounded-[3rem] border-white/5"
                            >
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black italic">
                                    The stars await your first command
                                </p>
                            </motion.div>
                        ) : items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.8 }}
                                className={`group p-8 rounded-[3rem] glass-morphism border-white/5 transition-all duration-700 ${item.isCompleted ? "opacity-50" : "hover:border-cyan-500/20"
                                    }`}
                            >
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => toggleComplete(item._id, item.isCompleted)}
                                        className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${item.isCompleted
                                            ? "bg-cyan-500 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                            : "border-white/10 hover:border-cyan-500/50"
                                            }`}
                                    >
                                        {item.isCompleted ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-cyan-500/50 transition-colors" />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-xl font-black tracking-tight transition-all duration-700 ${item.isCompleted ? "text-white/40 line-through" : "text-white group-hover:text-cyan-400"
                                            }`}>
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-sm text-white/30 mt-2 font-medium italic opacity-80">
                                                "{item.description}"
                                            </p>
                                        )}
                                        {item.isCompleted && (
                                            <p className="text-[9px] text-cyan-500 font-black uppercase mt-4 tracking-[0.3em]">
                                                REALIZED {new Date(item.completedDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#060614]/95 backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-xl glass-morphism border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px]" />

                            <h2 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase italic">
                                NEW <span className="text-gradient-cyan">AMBITION</span>
                            </h2>

                            <form onSubmit={handleCreate} className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">Ambition Title</label>
                                    <input
                                        autoFocus
                                        value={newItem.title}
                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                        placeholder="WHERE SHALL WE GO?"
                                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-8 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-all font-black text-sm uppercase tracking-widest"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">The Dream Detail</label>
                                    <textarea
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        placeholder="WHY DOES THIS MATTER TO US?"
                                        className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] px-8 py-6 text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 min-h-[160px] resize-none transition-all font-medium text-sm"
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        BELAY
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/5"
                                    >
                                        MANIFEST
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
