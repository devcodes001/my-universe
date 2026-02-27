"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function OnThisDayWidget({ memories = [], journals = [] }) {
    const [expanded, setExpanded] = useState(false);
    const hasContent = memories.length > 0 || journals.length > 0;

    if (!hasContent) return null;

    const totalItems = memories.length + journals.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border-white/10 relative overflow-hidden group cursor-pointer"
            onClick={() => setExpanded(!expanded)}
        >
            {/* Warm glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 blur-[80px] rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🕰️</span>
                        <div>
                            <h3 className="text-[10px] font-black text-amber-400/80 uppercase tracking-[0.3em]">
                                On This Day
                            </h3>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">
                                {totalItems} {totalItems === 1 ? "memory" : "memories"} from the past
                            </p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        className="text-white/20 text-sm"
                    >
                        ▼
                    </motion.div>
                </div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                {memories.map((mem) => (
                                    <div
                                        key={mem._id}
                                        className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5"
                                    >
                                        {mem.imageUrl ? (
                                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={mem.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                                                {mem.mood}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{mem.title}</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest">
                                                {new Date(mem.date).getFullYear()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {journals.map((j) => (
                                    <div
                                        key={j._id}
                                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/5"
                                    >
                                        <p className="text-sm text-white/70 italic line-clamp-2">
                                            &ldquo;{j.content}&rdquo;
                                        </p>
                                        <p className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">
                                            {j.authorName} • {new Date(j.date).getFullYear()} {j.mood}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!expanded && memories.length > 0 && (
                    <div className="flex -space-x-2 mt-2">
                        {memories.slice(0, 4).map((mem, i) => (
                            <div
                                key={mem._id}
                                className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#060614] overflow-hidden"
                            >
                                {mem.imageUrl ? (
                                    <img src={mem.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs">
                                        {mem.mood}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
