"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        partnerEmail: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            // Auto sign-in after registration
            const signInRes = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (signInRes?.error) {
                setError("Registered! But auto-login failed. Please sign in manually.");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="relative min-h-screen bg-[#060614] flex items-center justify-center px-4 py-12">
            <StarField />

            {/* Background atmosphere */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 blur-[120px] opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass-morphism border-white/[0.08] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/10 blur-[80px] rounded-full" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />

                    {/* Header */}
                    <div className="text-center mb-10 relative z-10">
                        <motion.div
                            className="w-20 h-20 glass-morphism rounded-[1.5rem] mx-auto flex items-center justify-center border-white/10 mb-6"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="text-4xl">💫</span>
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            CREATE YOUR <span className="text-gradient">UNIVERSE</span>
                        </h1>
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.4em] font-bold mt-3">
                            Initialize a new orbit for two
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={`transition-all duration-500 rounded-full ${s === step ? "w-8 h-2 bg-white" : s < step ? "w-2 h-2 bg-white/50" : "w-2 h-2 bg-white/10"}`}
                            />
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        placeholder="What should we call you?"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/15 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">
                                        Email Frequency
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/15 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">
                                        Secret Key
                                    </label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        placeholder="At least 6 characters"
                                        minLength={6}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/15 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => {
                                        if (form.name && form.email && form.password.length >= 6) {
                                            setStep(2);
                                            setError("");
                                        } else {
                                            setError("Please fill all fields (password must be 6+ characters)");
                                        }
                                    }}
                                    className="w-full py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-white/10 transition-all"
                                >
                                    CONTINUE →
                                </motion.button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <span className="text-4xl block mb-3">💕</span>
                                    <p className="text-sm text-white/50 italic font-medium">
                                        Link your partner to share your universe
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">
                                        Partner&apos;s Email <span className="text-white/15">(optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        autoFocus
                                        value={form.partnerEmail}
                                        onChange={(e) => updateField("partnerEmail", e.target.value)}
                                        placeholder="partner@example.com"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/15 focus:outline-none focus:border-pink-500/50 transition-all text-sm font-medium"
                                    />
                                    <p className="text-[9px] text-white/15 font-bold ml-2 mt-2 uppercase tracking-widest">
                                        If already registered, you&apos;ll be linked automatically ✨
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="py-5 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        ← BACK
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-white/10 disabled:opacity-50 transition-all"
                                    >
                                        {loading ? "CREATING..." : "LAUNCH ✨"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-8 relative z-10">
                        <p className="text-xs text-white/20 uppercase tracking-widest font-bold">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Reconnect →
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
