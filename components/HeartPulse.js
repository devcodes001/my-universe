"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeartPulse() {
    const [pulseActive, setPulseActive] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // Poll for partner's pulse every 10 seconds
        const checkPulse = async () => {
            try {
                const res = await fetch("/api/pulse");
                const data = await res.json();
                if (data.pulse) {
                    const lastPulseTime = new Date(data.pulse.lastPulse).getTime();
                    const now = new Date().getTime();
                    // If pulse was in the last 60 seconds, show it as active
                    if (now - lastPulseTime < 60000) {
                        setPulseActive(true);
                        // Reset after a few seconds of glowing
                        setTimeout(() => setPulseActive(false), 5000);
                    }
                }
            } catch (err) {
                console.error("Pulse check failed", err);
            }
        };

        const interval = setInterval(checkPulse, 10000);
        checkPulse(); // Initial check
        return () => clearInterval(interval);
    }, []);

    const sendPulse = async () => {
        if (sending) return;
        setSending(true);
        try {
            await fetch("/api/pulse", { method: "POST" });
            // Flash for feedback
            setTimeout(() => setSending(false), 1000);
        } catch (err) {
            setSending(false);
        }
    };

    return (
        <div className="relative">
            <motion.button
                onClick={sendPulse}
                whileTap={{ scale: 0.8 }}
                className={`relative p-2 rounded-full transition-all duration-500 ${pulseActive
                        ? "bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                        : "hover:bg-white/5"
                    }`}
            >
                <motion.span
                    animate={pulseActive ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                    } : {}}
                    transition={{ duration: 1, repeat: pulseActive ? Infinity : 0 }}
                    className={`text-xl block ${pulseActive ? "filter drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" : "grayscale opacity-40 hover:grayscale-0 hover:opacity-100"}`}
                >
                    ❤️
                </motion.span>

                {/* Sending Flash */}
                <AnimatePresence>
                    {sending && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-pink-500 rounded-full"
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Notification Bubble */}
            <AnimatePresence>
                {pulseActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg"
                    >
                        Thinking of you! ✨
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-500 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
