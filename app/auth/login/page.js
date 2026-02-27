"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
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

    return (
        <div className="relative min-h-screen bg-[#060614] flex items-center justify-center px-4">
            <StarField />

            {/* Background atmosphere */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-[120px] opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass-morphism border-white/[0.08] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />

                    {/* Header */}
                    <div className="text-center mb-10 relative z-10">
                        <motion.div
                            className="w-20 h-20 glass-morphism rounded-[1.5rem] mx-auto flex items-center justify-center border-white/10 mb-6"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="text-4xl">🌙</span>
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            WELCOME <span className="text-gradient">BACK</span>
                        </h1>
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.4em] font-bold mt-3">
                            Re-enter your cosmos
                        </p>
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
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-2">
                                Email Frequency
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, email: e.target.value }))
                                }
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
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, password: e.target.value }))
                                }
                                placeholder="••••••••"
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/15 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    RECONNECTING...
                                </span>
                            ) : (
                                "RECONNECT"
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-8 relative z-10">
                        <p className="text-xs text-white/20 uppercase tracking-widest font-bold">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Initialize Orbit →
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
