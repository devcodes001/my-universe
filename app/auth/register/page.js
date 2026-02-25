"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

export default function RegisterPage() {
    const router = useRouter();
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
            // Register
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

    return (
        <div className="relative min-h-screen bg-[#060614] flex items-center justify-center px-4 py-12">
            <StarField />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-[#0d0d24]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.span
                            className="text-5xl block mb-3"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            💫
                        </motion.span>
                        <h1 className="text-2xl font-bold text-white">
                            Create Your Universe
                        </h1>
                        <p className="text-sm text-white/40 mt-1">
                            Start your love story today
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                placeholder="Your name"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, password: e.target.value }))
                                }
                                placeholder="At least 6 characters"
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">
                                Partner&apos;s Email{" "}
                                <span className="text-white/30">(optional)</span>
                            </label>
                            <input
                                type="email"
                                value={form.partnerEmail}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        partnerEmail: e.target.value,
                                    }))
                                }
                                placeholder="partner@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                            />
                            <p className="text-xs text-white/25 mt-1">
                                If your partner already has an account, you&apos;ll be linked
                                automatically
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                "Create Universe ✨"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/30 mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Sign in →
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
