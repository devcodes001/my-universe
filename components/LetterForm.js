"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LetterForm({ onAdd, onClose }) {
    const [form, setForm] = useState({
        title: "",
        content: "",
        openDate: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // Minimum date is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content || !form.openDate) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/letters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const data = await res.json();
                onAdd(data.letter);
                onClose();
            }
        } catch (err) {
            console.error("Failed to create letter:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-[#060614] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden max-h-[85vh] overflow-y-auto"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/5 blur-[80px]" />

                <h2 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 tracking-tighter uppercase italic">
                    TIME <span className="text-gradient">CAPSULE</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">Legacy Title</label>
                        <input
                            type="text"
                            value={form.title}
                            autoFocus
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, title: e.target.value.toUpperCase() }))
                            }
                            onFocus={(e) => e.target.select()}
                            placeholder="FOR OUR ETERNAL MOMENT..."
                            className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-2xl md:rounded-[1.5rem] bg-white/5 border border-white/5 text-white placeholder-white/10 focus:outline-none focus:border-pink-500/50 transition-all font-black text-xs md:text-sm uppercase tracking-widest"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">The Shared Heart</label>
                        <textarea
                            value={form.content}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, content: e.target.value }))
                            }
                            placeholder="DEAR FUTURE US..."
                            rows={4}
                            className="w-full px-5 md:px-6 py-4 md:py-5 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 text-white placeholder-white/10 focus:outline-none focus:border-pink-500/50 transition-all resize-none font-medium text-sm md:text-base leading-relaxed"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">📅 Horizon Date</label>
                        <input
                            type="date"
                            value={form.openDate}
                            min={minDate}
                            max="2100-12-31"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length > 10) return;
                                setForm((prev) => ({ ...prev, openDate: val }));
                            }}
                            className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-2xl md:rounded-[1.5rem] bg-white/5 border border-white/5 text-white focus:outline-none focus:border-pink-500/50 transition-all font-black text-xs md:text-sm"
                            required
                        />
                        <p className="text-[8px] md:text-[9px] text-white/20 uppercase tracking-[0.2em] font-black ml-2">
                            SEALED UNTIL THE CHOSEN HORIZON ✨
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-3.5 md:py-4 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            BELAY
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="py-3.5 md:py-4 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                        >
                            {submitting ? "SEALING..." : "MANIFEST"}
                        </button>
                    </div>
                </form>
            </motion.div>

        </motion.div>
    );
}
