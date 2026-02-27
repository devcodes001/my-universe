"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceRecorder from "./VoiceRecorder";

export default function AddMemoryForm({ onAdd, onClose }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "everyday",
        mood: "❤️",
        imageUrl: "",
        audioUrl: "",
    });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const moods = ["❤️", "😊", "🥰", "✨", "🌟", "🎉", "🥺", "💫"];
    const categories = [
        { value: "milestone", label: "🏆 Milestone" },
        { value: "date", label: "💕 Date" },
        { value: "travel", label: "✈️ Travel" },
        { value: "everyday", label: "☀️ Everyday" },
        { value: "special", label: "⭐ Special" },
    ];

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setForm((prev) => ({ ...prev, imageUrl: data.url }));
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.date) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/memories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const data = await res.json();
                onAdd(data.memory);
                onClose();
            }
        } catch (err) {
            console.error("Failed to create memory:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#12122a] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <span className="text-2xl">✨</span> New Memory
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-base font-bold text-white/80 mb-2">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Our first sunset together..."
                            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-base placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-base font-bold text-white/80 mb-2">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Tell the story..."
                            rows={3}
                            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-base placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                        />
                    </div>

                    {/* Date & Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-bold text-white/80 mb-2">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, date: e.target.value }))
                                }
                                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-purple-500/50 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-white/80 mb-2">
                                Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, category: e.target.value }))
                                }
                                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-purple-500/50 transition-all"
                            >
                                {categories.map((cat) => (
                                    <option
                                        key={cat.value}
                                        value={cat.value}
                                        className="bg-[#12122a]"
                                    >
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* Mood */}
                    <div>
                        <label className="block text-base font-bold text-white/80 mb-4">How do you feel about this?</label>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar snap-x">
                            {moods.map((mood) => (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, mood }))}
                                    className={`text-3xl w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-2xl transition-all snap-center ${form.mood === mood
                                        ? "bg-purple-500/20 border border-purple-500/40 scale-110 shadow-lg shadow-purple-500/10"
                                        : "bg-white/5 border border-white/10"
                                        }`}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-base font-bold text-white/80 mb-2">
                            Photo (optional)
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center px-4 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/40 hover:border-purple-500/40 hover:text-white/60 cursor-pointer transition-all">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {uploading
                                    ? "⏳ Uploading..."
                                    : form.imageUrl
                                        ? "✅ Photo added"
                                        : "📷 Choose a photo"}
                            </label>
                            {form.imageUrl && (
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img
                                        src={form.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <VoiceRecorder onUploadComplete={(url) => setForm(prev => ({ ...prev, audioUrl: url }))} />

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all font-bold text-sm uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm uppercase tracking-widest hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
                        >
                            {submitting ? "Saving..." : "Save ✨"}
                        </button>
                    </div>

                </form>
            </motion.div>
        </motion.div>
    );
}
