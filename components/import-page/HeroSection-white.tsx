'use client';

import { motion, easeInOut } from "framer-motion";
import { ShaderBackground } from '../ui/ShaderBackground';
import InputSection from '../InputSection';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeInOut,
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeInOut
    }
  }
};

export const HeroSection = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* WebGL Shader Background - Only for header */}
      <div className="absolute inset-0 z-0">
        {!isMounted ? (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "#ffffff",
              backgroundImage: `
        radial-gradient(
          circle at top left,
          rgba(173, 109, 244, 0.5),
          transparent 70%
        )
      `,
              filter: "blur(80px)",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : theme === "dark" ? (
          <ShaderBackground />
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "#ffffff",
              backgroundImage: `
        radial-gradient(
          circle at top left,
          rgba(173, 109, 244, 0.5),
          transparent 70%
        )
      `,
              filter: "blur(80px)",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70  from-70% to-95% to-transparent" />

      {/* Hero Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center min-h-screen sm:pt-10 md:pt-20 pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-4xl mx-auto space-y-14 sm:space-y-12 text-center">
          {/* Main Title and Instructions */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Transform Your Content Into
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Interactive Courses
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Import content from multiple sources - text, URLs, documents, videos, or audio - and we&apos;ll create a structured course for you. Once your course is ready, you can create personalized exams, flashcards, and quizzes directly from the course page.
            </p>
            
            {/* Visual indicator pointing to input */}
            <motion.div 
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span>↓ Choose your import method to create a course ↓</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full"
            variants={itemVariants}
          >
            <InputSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}; 