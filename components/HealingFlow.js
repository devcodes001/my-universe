"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastProvider";

/**
 * HealingFlow — A guided reflection after a fight.
 * Three-step process: What hurt → What you learned → What you'll do differently
 * Reflections are hidden from partner for 24 hours to ensure honest, independent answers.
 */
export default function HealingFlow({ onClose, onComplete }) {
    const toast = useToast();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        whatHurt: "",
        whatLearned: "",
        doDifferently: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const steps = [
        {
            key: "whatHurt",
            icon: "💔",
            title: "What hurt you?",
            subtitle: "Be honest with yourself. This is a safe space.",
            placeholder: "I felt hurt when...",
            color: "from-red-500/20 to-rose-500/20",
            borderColor: "border-red-500/30",
            focusBorder: "focus:border-red-500/50",
        },
        {
            key: "whatLearned",
            icon: "🌱",
            title: "What did you learn?",
            subtitle: "Every conflict teaches us something about each other.",
            placeholder: "I realized that...",
            color: "from-amber-500/20 to-yellow-500/20",
            borderColor: "border-amber-500/30",
            focusBorder: "focus:border-amber-500/50",
        },
        {
            key: "doDifferently",
            icon: "🤝",
            title: "What will you do differently?",
            subtitle: "Growth is choosing better, together.",
            placeholder: "Next time, I will...",
            color: "from-emerald-500/20 to-green-500/20",
            borderColor: "border-emerald-500/30",
            focusBorder: "focus:border-emerald-500/50",
        },
    ];

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;

    const handleNext = () => {
        if (!form[currentStep.key].trim()) return;
        if (isLastStep) {
            handleSubmit();
        } else {
            setStep(step + 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/reflections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                toast.love("Your reflection has been saved. Your partner's answers will appear after 24 hours. 💛");
                onComplete?.();
                onClose();
            } else {
                toast.error("Failed to save reflection. Please try again.");
            }
        } catch (err) {
            console.error("Healing flow error:", err);
            toast.error("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#060614]/98 backdrop-blur-2xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="w-full max-w-lg relative"
            >
                {/* Progress dots */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-500 rounded-full ${i === step
                                ? "w-8 h-2 bg-white"
                                : i < step
                                    ? "w-2 h-2 bg-white/50"
                                    : "w-2 h-2 bg-white/10"
                                }`}
                        />
                    ))}
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-gradient-to-br ${currentStep.color} border ${currentStep.borderColor} rounded-[3rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl`}
                    >
                        <div className="text-center mb-8">
                            <span className="text-5xl block mb-4">{currentStep.icon}</span>
                            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                                {currentStep.title}
                            </h2>
                            <p className="text-sm text-white/40 italic">
                                {currentStep.subtitle}
                            </p>
                        </div>

                        <textarea
                            autoFocus
                            value={form[currentStep.key]}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    [currentStep.key]: e.target.value,
                                }))
                            }
                            placeholder={currentStep.placeholder}
                            className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/20 ${currentStep.focusBorder} focus:outline-none transition-all min-h-[150px] resize-none text-base leading-relaxed`}
                        />

                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                onClick={step > 0 ? () => setStep(step - 1) : onClose}
                                className="flex-1 py-4 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 text-xs font-black uppercase tracking-widest transition-all"
                            >
                                {step > 0 ? "Back" : "Cancel"}
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNext}
                                disabled={!form[currentStep.key].trim() || submitting}
                                className="flex-1 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-30 transition-all"
                            >
                                {submitting ? "Saving..." : isLastStep ? "Submit Reflection" : "Continue"}
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Privacy note */}
                <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-6">
                    🔒 Your partner&apos;s answers appear after 24 hours
                </p>
            </motion.div>
        </motion.div>
    );
}
