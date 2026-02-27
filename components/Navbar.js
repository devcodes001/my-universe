"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeartPulse from "./HeartPulse";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Don't show navbar on landing or auth pages
    if (
        pathname === "/" ||
        pathname.startsWith("/auth")
    ) {
        return null;
    }

    const navLinks = [
        { href: "/dashboard", label: "Home", icon: "🌌" },
        { href: "/memories", label: "Timeline", icon: "💫" },
        { href: "/journal", label: "Moods", icon: "📓" },
        { href: "/bucket-list", label: "Bucket List", icon: "✈️" },
        { href: "/letters", label: "Archive", icon: "💌" },
        { href: "/our-story", label: "Our Story", icon: "📊" },
    ];

    const isActive = (path) => pathname === path;

    return (
        <>
            {/* Top Navbar: Brand & Interaction (Compact on mobile) */}
            <nav className="fixed top-0 inset-x-0 z-[100] p-4 sm:p-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                    {/* Brand Logo */}
                    <Link href="/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-morphism px-6 py-3 rounded-full flex items-center gap-3 border-white/5 active:bg-white/10 transition-colors"
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/90">
                                Universe
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation Only */}
                    <div className="hidden md:flex items-center gap-2 glass-morphism p-1.5 rounded-full border-white/5">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative ${isActive(link.href)
                                    ? "text-black"
                                    : "text-white/40 hover:text-white/80"
                                    }`}>
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Interaction Section */}
                    <div className="flex items-center gap-3">
                        <div className="glass-morphism p-1.5 rounded-full border-white/5 flex items-center gap-1">
                            <HeartPulse />
                            <div className="hidden sm:flex items-center gap-1">
                                <ThemeSwitcher />
                                <div className="w-px h-6 bg-white/10 mx-1" />
                            </div>

                            <div className="hidden sm:flex items-center px-4 py-2 bg-white/5 rounded-full">
                                <span className="text-[11px] font-black uppercase tracking-widest text-white/40">
                                    {session?.user?.name}
                                </span>
                            </div>

                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                                title="Sign Out"
                            >
                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation - iPhone Style Tab Bar */}
            <div className="md:hidden fixed bottom-6 inset-x-6 z-[200] glass-morphism rounded-[2.5rem] border-white/10 p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 pointer-events-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex-1 relative z-10">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-300 ${isActive(link.href) ? "text-white" : "text-white/25 hover:text-white/50"
                                }`}
                        >
                            <span className="text-xl sm:text-2xl">{link.icon}</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{link.label}</span>
                            {isActive(link.href) && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="w-1 h-1 bg-white rounded-full mt-1.5"
                                />
                            )}
                        </motion.div>
                    </Link>
                ))}
            </div>
        </>
    );
}
