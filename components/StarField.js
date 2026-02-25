"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StarField() {
    const [stars, setStars] = useState([]);
    const [nebulae, setNebulae] = useState([]);

    useEffect(() => {
        // Generate stars
        const newStars = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            size: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
        setStars(newStars);

        // Generate subtle nebulae/glows
        const newNebulae = Array.from({ length: 3 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 400 + 300,
            color: i === 0 ? 'var(--primary-glow)' : i === 1 ? 'var(--secondary-glow)' : 'rgba(139, 92, 246, 0.1)',
        }));
        setNebulae(newNebulae);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Base */}
            <div className="absolute inset-0 bg-[#060614]" />

            {/* Dynamic Nebulae */}
            {nebulae.map((n) => (
                <motion.div
                    key={n.id}
                    className="absolute rounded-full blur-[120px] opacity-[0.07]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 15 + n.id * 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        left: n.left,
                        top: n.top,
                        width: n.size,
                        height: n.size,
                        backgroundColor: n.color,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}

            {/* Stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-0"
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        width: star.size,
                        height: star.size,
                        left: star.left,
                        top: star.top,
                        boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px white` : 'none',
                    }}
                />
            ))}

            {/* Static Deep Stars */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0))',
                    backgroundSize: '200px 200px'
                }}
            />
        </div>
    );
}
