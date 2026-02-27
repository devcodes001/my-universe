"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function JournalForm({ onAdd }) {
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("😊");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moods = ["✨", "❤️", "😊", "🥰", "🌟", "🎉", "🥺", "💫", "🍃", "☁️"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/journals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, mood }),
            });

            if (res.ok) {
                const data = await res.json();
                onAdd(data.journal);
                setContent("");
                setMood("😊");
            }
        } catch (err) {
            console.error("Failed to save journal:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] glass-morphism border-white/10 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px]" />

            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase italic">
                CAPTURE THE <span className="text-gradient">PRESENT</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-4">
                    <label className="text-[11px] text-white/30 uppercase tracking-[0.4em] font-black ml-4">Inner Monologue</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="WHAT'S ON YOUR CELESTIAL RADIUS?"
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-5 md:p-8 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all min-h-[140px] md:min-h-[180px] resize-none font-medium text-sm md:text-base"
                        required
                    />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="w-full lg:w-auto overflow-hidden">
                        <p className="text-[11px] text-white/20 uppercase tracking-[0.4em] font-black mb-6 ml-4">Current frequency</p>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                            {moods.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMood(m)}
                                    className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center rounded-2xl md:rounded-3xl transition-all duration-500 ${mood === m
                                        ? "bg-white text-black scale-105 shadow-2xl"
                                        : "glass bg-white/5 text-white/30 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <span className="text-2xl md:text-3xl">{m}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full lg:w-auto px-12 py-6 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-white/5 disabled:opacity-50 transition-all mt-4 lg:mt-0"
                    >
                        {isSubmitting ? "TRANSMITTING..." : "ARCHIVE MOMENT"}
                    </motion.button>
                </div>
            </form>

        </motion.div>
    );
}
