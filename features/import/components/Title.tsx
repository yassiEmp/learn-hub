import React from 'react';
import AnimatedTextCycle from '@/components/ui/AnimatedTextCycle';
import { motion , Variants } from 'framer-motion';

const headingPhrases = [
    "Flash Card", 
    "Multiple Choice Question",
    "Spaced Repatition",
    "learn Effectively",
    "learn Quick",
    "Get Good Grades",
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
                    className="text-foreground"
                />
            </motion.span>
            <motion.span 
                className="bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/80 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                variants={lineVariants}
            >
                with AI
            </motion.span>
        </motion.h1>
    );
});

Title.displayName = 'Title';

export default Title;