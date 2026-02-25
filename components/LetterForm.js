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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-[#060614] border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[100px]" />

                <h2 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase italic">
                    TIME <span className="text-gradient">CAPSULE</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">Legacy Title</label>
                        <input
                            type="text"
                            value={form.title}
                            autoFocus
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, title: e.target.value.toUpperCase() }))
                            }
                            onFocus={(e) => e.target.select()}
                            placeholder="FOR OUR ETERNAL MOMENT..."
                            className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 text-white placeholder-white/10 focus:outline-none focus:border-pink-500/50 transition-all font-black text-sm uppercase tracking-widest"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">The Shared Heart</label>
                        <textarea
                            value={form.content}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, content: e.target.value }))
                            }
                            placeholder="DEAR FUTURE US..."
                            rows={8}
                            className="w-full px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/5 text-white placeholder-white/10 focus:outline-none focus:border-pink-500/50 transition-all resize-none font-medium text-base leading-relaxed"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">📅 Horizon Date</label>
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
                            className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 text-white focus:outline-none focus:border-pink-500/50 transition-all font-black text-sm"
                            required
                        />
                        <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black mt-2 ml-2">
                            THIS FREQUENCY WILL STAY SEALED UNTIL THE CHOSEN HORIZON ✨
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            BELAY
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="py-5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                        >
                            {submitting ? "SEALING..." : "MANIFEST LEGACY"}
                        </button>
                    </div>
                </form>
            </motion.div>

        </motion.div>
    );
}
