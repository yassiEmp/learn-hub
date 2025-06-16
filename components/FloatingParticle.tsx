import React from 'react'
import { motion } from 'framer-motion'

const FloatingParticle = () => {
    {/* Floating particles */ }
    return [...Array(20)].map((_, i) => {
        const baseX = (i * 5) % 100;
        const baseY = (i * 7) % 100;
        const duration = 4 + (i % 3);
        const delay = (i * 0.2) % 2;

        return (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                animate={{
                    x: [0, (baseX - 50)],
                    y: [0, (baseY - 50)],
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                }}
                style={{
                    left: `${baseX}%`,
                    top: `${baseY}%`,
                }}
            />
        );
    })
}

export default FloatingParticle