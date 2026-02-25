"use client";

import { motion } from "framer-motion";

export default function MemoryCard({ memory, onDelete, onView, index }) {
    const categoryColors = {
        milestone: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
        date: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
        travel: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
        everyday: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
        special: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    };

    const categoryLabels = {
        milestone: "🏆 Milestone",
        date: "💕 Date",
        travel: "✈️ Travel",
        everyday: "☀️ Everyday",
        special: "⭐ Special",
    };

    const formattedDate = new Date(memory.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-[2.5rem] glass-morphism p-4 sm:p-5 border-white/5 transition-all duration-700`}
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity duration-700 group-hover:opacity-20 bg-gradient-to-br ${memory.category === 'milestone' ? 'from-amber-500' :
                memory.category === 'date' ? 'from-pink-500' :
                    'from-purple-500'
                }`} />

            {/* Image Section */}
            <div className="relative mb-5 rounded-[2rem] overflow-hidden aspect-[4/3] bg-[#0a0a1a]">
                <img
                    src={memory.imageUrl || "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=800&auto=format&fit=crop"}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Badge Over Image */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full glass bg-black/40 text-xs font-black uppercase tracking-[0.2em] text-white/90">
                        {categoryLabels[memory.category] || "☀️ Everyday"}
                    </span>
                </div>

                {/* Mood Indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass bg-black/40 flex items-center justify-center text-xl">
                    {memory.mood}
                </div>
            </div>

            {/* Content Section */}
            <div className="px-2">
                <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">
                        {new Date(memory.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    {memory.audioUrl && (
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
                    )}
                </div>

                <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-purple-300 transition-colors">
                    {memory.title}
                </h3>

                {memory.description && (
                    <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-6 italic">
                        "{memory.description}"
                    </p>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(memory);
                        }}
                        className="text-xs font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors"
                    >
                        Explore →
                    </button>


                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(memory._id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
