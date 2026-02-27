"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastProvider";

/**
 * QuestionOfTheDay — Both partners answer independently.
 * Answers are revealed only after both have responded.
 */
export default function QuestionOfTheDay() {
    const toast = useToast();
    const [data, setData] = useState(null);
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestion();
    }, []);

    const fetchQuestion = async () => {
        try {
            const res = await fetch("/api/questions");
            if (res.ok) {
                const q = await res.json();
                setData(q);
            }
        } catch (err) {
            console.error("Failed to fetch question:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;
        setSubmitting(true);

        try {
            const res = await fetch("/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: data.questionId,
                    questionText: data.questionText,
                    answer,
                }),
            });

            if (res.ok) {
                toast.love("Answer submitted! 💫");
                setAnswer("");
                fetchQuestion();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to submit");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !data) return null;

    const hasAnswered = !!data.myAnswer;
    const partnerWaiting = data.partnerAnswer?.answered && !data.bothAnswered;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-[2.5rem] p-6 md:p-8 border-white/10 relative overflow-hidden"
        >
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 blur-[80px] rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-xl">💬</span>
                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                        Question of the Day
                    </h3>
                </div>

                <p className="text-base md:text-lg font-bold text-white leading-relaxed mb-6 italic">
                    &ldquo;{data.questionText}&rdquo;
                </p>

                {/* Both answered — reveal! */}
                {data.bothAnswered && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Your Answer</p>
                            <p className="text-sm text-white/80 italic">&ldquo;{data.myAnswer.answer}&rdquo;</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-purple-500/[0.05] border border-purple-500/20">
                            <p className="text-[9px] font-black text-purple-400/60 uppercase tracking-widest mb-2">{data.partnerAnswer.authorName}</p>
                            <p className="text-sm text-purple-100/80 italic">&ldquo;{data.partnerAnswer.answer}&rdquo;</p>
                        </div>
                    </div>
                )}

                {/* Already answered, waiting for partner */}
                {hasAnswered && !data.bothAnswered && (
                    <div className="text-center py-6">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-3xl mb-3"
                        >
                            {partnerWaiting ? "✨" : "⏳"}
                        </motion.div>
                        <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
                            {partnerWaiting
                                ? "Both answered! Refresh to reveal ✨"
                                : "Waiting for your partner's answer..."}
                        </p>
                        <p className="text-xs text-white/20 mt-2 italic">Your answer: &ldquo;{data.myAnswer.answer}&rdquo;</p>
                    </div>
                )}

                {/* Haven't answered yet */}
                {!hasAnswered && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Your honest answer..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white placeholder:text-white/15 focus:outline-none focus:border-cyan-500/50 transition-all min-h-[80px] resize-none text-sm"
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitting || !answer.trim()}
                            className="w-full py-3.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg disabled:opacity-30 transition-all"
                        >
                            {submitting ? "Submitting..." : "Lock In Answer 🔒"}
                        </motion.button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}
