"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}

const ICONS = {
    success: "✨",
    error: "⚠️",
    info: "💫",
    love: "💖",
};

const COLORS = {
    success: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    error: "from-red-500/20 to-rose-500/20 border-red-500/30",
    info: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    love: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const toast = {
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
        info: (msg) => addToast(msg, "info"),
        love: (msg) => addToast(msg, "love"),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-20 right-4 z-[300] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className={`pointer-events-auto bg-gradient-to-r ${COLORS[t.type]} backdrop-blur-xl border rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3`}
                        >
                            <span className="text-xl flex-shrink-0">{ICONS[t.type]}</span>
                            <p className="text-sm font-semibold text-white/90">{t.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
