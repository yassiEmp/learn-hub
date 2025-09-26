import React from 'react';
import AnimatedTextCycle from '@/components/ui/AnimatedTextCycle';
import { motion , Variants } from 'framer-motion';

const headingPhrases = [
    "Generate Flash Card", 
    "Generate MCQ's",
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
            className="text-3xl sm:text-4xl md:text-5xl font-syne font-medium leading-tight tracking-tight text-center mb-8"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.span 
                className="text-white block mb-2 text-center"
                variants={lineVariants}
            >
                <AnimatedTextCycle 
                    words={headingPhrases}
                    interval={3000}
                    className="text-foreground"
                />
            </motion.span>
        </motion.h1>
    );
});

Title.displayName = 'Title';

export default Title;