import React from 'react';
import AnimatedTextCycle from '../../../components/ui/AnimatedTextCycle';
import { motion } from 'framer-motion';

const headingPhrases = [
    "Create Courses",
    "Learn Quickly", 
    "Get Good Grades",
    "Master Skills",
    "Teach Effectively",
    "Boost Knowledge",
];

const Title: React.FC = React.memo(() => {
    const titleVariants = {
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

    const lineVariants = {
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight sm:leading-loose tracking-tight h-full flex flex-col justify-center items-center gap-2 sm:gap-4 font-unbounded text-center"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.span 
                className="text-white drop-shadow-lg transition-all duration-300 flex justify-center items-center"
                variants={lineVariants}
            >
                <AnimatedTextCycle 
                    words={headingPhrases}
                    interval={3000}
                    className="text-white drop-shadow-lg text-center"
                />
            </motion.span>
            <motion.span 
                className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center"
                variants={lineVariants}
            >
                with AI
            </motion.span>
        </motion.h1>
    );
});

Title.displayName = 'Title';

export default Title;