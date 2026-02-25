"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function LetterCard({ letter, index }) {
    const { data: session } = useSession();
    const now = new Date();
    const openDate = new Date(letter.openDate);
    const isAuthor = session?.user?.id === letter.userId;
    const canOpen = now >= openDate || isAuthor;

    const formattedOpenDate = openDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedCreatedDate = new Date(letter.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );

    // Days remaining
    const daysRemaining = Math.max(
        0,
        Math.ceil((openDate - now) / (1000 * 60 * 60 * 24))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-2xl border p-5 group transition-all ${canOpen
                ? "bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30 shadow-lg shadow-pink-500/5"
                : "bg-[#12122a]/40 backdrop-blur-sm border-white/10"
                }`}
        >
            {/* Decorative seal */}
            <div className="absolute top-3 right-3">
                <span className="text-3xl">{canOpen ? "📖" : "🔒"}</span>
            </div>

            {/* Glow */}
            <div
                className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl transition-all duration-700 ${canOpen
                    ? "bg-pink-500/15 group-hover:bg-pink-500/25"
                    : "bg-indigo-500/10 group-hover:bg-indigo-500/20"
                    }`}
            />

            <div className="relative">
                <span className="text-xs text-white/40">
                    Written on {formattedCreatedDate}
                </span>

                <h3 className="text-lg font-semibold text-white mt-2 mb-1 pr-10">
                    {letter.title}
                </h3>

                <p className="text-xs text-white/40 mb-3">
                    by {letter.authorName}
                </p>

                {canOpen ? (
                    /* Letter is opened or author is viewing */
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative">
                        {isAuthor && now < openDate && (
                            <div className="absolute -top-3 left-4 px-3 py-1 bg-purple-600 text-[9px] font-black uppercase tracking-widest rounded-full text-white">
                                Author Preview
                            </div>
                        )}
                        <p className="text-base text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
                            {letter.content}
                        </p>
                    </div>
                ) : (
                    /* Letter is sealed for non-author */
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/5 text-center relative overflow-hidden group/seal">
                        <div className="absolute inset-0 bg-purple-500/5 blur-xl group-hover/seal:bg-purple-500/10 transition-colors" />
                        <p className="text-5xl mb-4 relative z-10 group-hover/seal:scale-110 transition-transform">🔒</p>
                        <p className="text-xs text-white/50 uppercase tracking-widest font-black relative z-10">
                            Sealed until
                        </p>
                        <p className="text-xl font-black text-purple-400 mt-2 relative z-10 tracking-tight">
                            {daysRemaining} DAYS REMAINING
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
                        {canOpen ? "UNLOCKED" : "OPENS"} {formattedOpenDate}
                    </span>
                    <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${canOpen
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}
                    >
                        {isAuthor && now < openDate ? "DRAFT" : (canOpen ? "OPENED" : "SEALED")}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
