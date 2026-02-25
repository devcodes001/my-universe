"use client";

import { motion } from "framer-motion";

export default function JournalCard({ journal, index, isMe }) {
    const formattedDate = new Date(journal.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className={`p-8 rounded-[2.5rem] glass-morphism border-white/5 relative group overflow-hidden ${isMe ? "bg-white/[0.02]" : "bg-purple-500/[0.03]"
                }`}
        >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${isMe ? "bg-white/20" : "bg-purple-500/40"
                }`} />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${isMe ? "bg-white/10 text-white/60" : "bg-purple-500/20 text-purple-300"
                            }`}>
                            {isMe ? "YOUR SOUL" : "PARTNER'S ECHO"}
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        {formattedDate}
                    </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {journal.mood}
                </div>
            </div>

            <div className="relative">
                <p className={`text-base leading-relaxed font-medium italic ${isMe ? "text-white/80" : "text-purple-100/80"
                    }`}>
                    "{journal.content}"
                </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-black">
                    {journal.authorName.toUpperCase()}
                </span>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-1 h-1 rounded-full ${isMe ? "bg-white/5" : "bg-purple-500/20"}`} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
