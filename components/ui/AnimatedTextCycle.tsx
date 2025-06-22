import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

export default React.memo(function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: "auto", height: "auto" });
  const measureRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  // Memoized dimension calculation
  const updateDimensions = useCallback(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const element = elements[currentIndex] as HTMLElement;
        const rect = element.getBoundingClientRect();
        
        setDimensions({
          width: `${Math.ceil(rect.width) + 2}px`,
          height: `${Math.ceil(rect.height) + 2}px`
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  // Optimized interval management
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, words.length]);

  // Optimized container animation with reduced motion
  const containerVariants : Variants = {
    hidden: { 
      y: -10,
      opacity: 0,
      scale: 0.99,
      filter: "blur(2px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      y: 10,
      opacity: 0,
      scale: 0.99,
      filter: "blur(2px)",
      transition: { 
        duration: 0.2, 
        ease: [0.4, 0, 1, 1]
      }
    },
  };

  return (
    <>
      {/* Hidden measurement div with all words rendered */}
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="fixed opacity-0 pointer-events-none top-[-9999px] left-[-9999px]"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`} style={{ whiteSpace: "nowrap" }}>
            {word}
          </span>
        ))}
      </div>

      {/* Visible animated word with exact dimensions */}
      <motion.span 
        className="relative inline-block overflow-visible p-1"
        animate={{ 
          width: dimensions.width,
          height: dimensions.height,
          transition: { 
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.6,
          }
        }}
        style={{
          minWidth: dimensions.width,
          minHeight: dimensions.height
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`absolute top-0 left-0 font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              whiteSpace: "nowrap",
              width: "fit-content",
              height: "fit-content"
            }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
});