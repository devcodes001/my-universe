"use client";

import { motion } from "framer-motion";

export default function DailyPromptWidget({ prompt, onUsePrompt }) {
    if (!prompt) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border-white/10 relative overflow-hidden group"
        >
            {/* Subtle purple glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">💭</span>
                    <h3 className="text-[10px] font-black text-purple-400/80 uppercase tracking-[0.3em]">
                        Daily Reflection
                    </h3>
                </div>

                <p className="text-base md:text-lg font-medium text-white/80 leading-relaxed italic mb-6">
                    &ldquo;{prompt}&rdquo;
                </p>

                {onUsePrompt && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onUsePrompt}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                    >
                        Write about this →
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
