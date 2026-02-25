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

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-[#0d0d24]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.span
                            className="text-5xl block mb-3"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🌙
                        </motion.span>
                        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                        <p className="text-sm text-white/40 mt-1">
                            Sign in to your universe
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
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                                required
                            />
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
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-white/30 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Create one →
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
