"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoveJar() {
    const [notes, setNotes] = useState([]);
    const [showNote, setShowNote] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [isJiggling, setIsJiggling] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch("/api/love-notes");
            const data = await res.json();
            setNotes(data.notes || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDraw = () => {
        if (notes.length === 0) return;
        setIsJiggling(true);
        setTimeout(() => {
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            setShowNote(randomNote);
            setIsJiggling(false);
        }, 600);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        try {
            const res = await fetch("/api/love-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newNote }),
            });
            if (res.ok) {
                const data = await res.json();
                setNotes([data.note, ...notes]);
                setNewNote("");
                setIsAdding(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                <motion.div
                    animate={isJiggling ? {
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                    } : {}}
                    onClick={handleDraw}
                    className="cursor-pointer relative group"
                >
                    <span className="text-8xl block filter drop-shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all">
                        🏺
                    </span>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-400 opacity-40 group-hover:opacity-100 transition-opacity">
                        ❤️
                    </div>
                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                        {notes.length}
                    </div>
                </motion.div>

                <p className="text-white/40 text-xs mt-3 uppercase tracking-widest font-medium">The Love Jar</p>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-pink-400/60 hover:text-pink-400 text-[10px] uppercase mt-2 font-bold tracking-tighter"
                >
                    + Add a Reason
                </button>
            </div>

            {/* Drawing Note Modal */}
            <AnimatePresence>
                {showNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-lg"
                        onClick={() => setShowNote(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 100, rotate: -10 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            exit={{ scale: 0.5, y: 100, opacity: 0 }}
                            className="bg-[#fff9e6] p-8 rounded-sm shadow-2xl max-w-sm w-full relative border-b-4 border-r-4 border-black/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Note texture/style */}
                            <div className="absolute top-4 left-4 border-l-2 border-pink-200 h-full -z-10" />
                            <button
                                onClick={() => setShowNote(null)}
                                className="absolute top-2 right-2 text-black/20 hover:text-black/40"
                            >
                                ✕
                            </button>

                            <div className="text-center py-4">
                                <span className="text-4xl block mb-4">💖</span>
                                <p className="text-gray-800 text-xl font-handwriting leading-relaxed italic">
                                    "{showNote.content}"
                                </p>
                                <div className="mt-8 pt-4 border-t border-black/5">
                                    <p className="text-gray-400 text-[10px] uppercase tracking-widest">
                                        Written by {showNote.authorName}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/98 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="w-full max-w-md bg-[#12122a] border border-white/10 rounded-3xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">✨ Add to the Love Jar</h3>
                            <form onSubmit={handleAdd}>
                                <textarea
                                    autoFocus
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="I love the way you smile when..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 min-h-[120px] mb-4"
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-3 rounded-2xl bg-white/5 text-white/60 hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg shadow-pink-500/20"
                                    >
                                        Save Secret
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
