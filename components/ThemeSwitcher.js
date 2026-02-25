"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState("midnight");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "midnight";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setIsOpen(false);
    };

    const themes = [
        { id: "midnight", name: "Midnight", icon: "🌌", color: "bg-purple-600" },
        { id: "rose", name: "Rose Garden", icon: "🌹", color: "bg-rose-500" },
        { id: "aurora", name: "Aurora", icon: "🌿", color: "bg-emerald-500" },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
                <span className="text-lg">{themes.find(t => t.id === theme)?.icon}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute right-0 mt-4 w-48 bg-[#12122a] border border-white/10 rounded-3xl p-3 shadow-2xl z-50 overflow-hidden"
                        >
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-3 ml-2">App Theme</p>
                            <div className="space-y-1">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => toggleTheme(t.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${theme === t.id
                                                ? "bg-white/10 text-white"
                                                : "text-white/40 hover:bg-white/5 hover:text-white/60"
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${t.color}`} />
                                        <span className="text-sm font-medium">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
