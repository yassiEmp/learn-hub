import React from 'react';
import AnimatedTextCycle from '@/components/ui/AnimatedTextCycle';
import { motion , Variants } from 'framer-motion';

const headingPhrases = [
    "Create Courses",
    "Learn Quickly", 
    "Master Skills",
    "Teach Effectively",
    "Build Knowledge",
    "Share Expertise",
];

const Title: React.FC = React.memo(() => {
    const titleVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 15,
            scale: 0.98
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1
            }
        }
    };

    const lineVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 10,
            scale: 0.99
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-syne font-medium leading-tight tracking-tight text-center"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.span 
                className="text-white block mb-2"
                variants={lineVariants}
            >
                <AnimatedTextCycle 
                    words={headingPhrases}
                    interval={3000}
                    className="text-white"
                />
            </motion.span>
            <motion.span 
                className="bg-gradient-to-r from-white/80 via-white/60 to-white/80 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                variants={lineVariants}
            >
                with AI
            </motion.span>
        </motion.h1>
    );
});

Title.displayName = 'Title';

export default Title;