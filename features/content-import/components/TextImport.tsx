"use client"
import React, { useState, useCallback, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImportResult, ImportTabProps } from '../utils/types';
// Auth is handled by the protected layout

export const TextImport: React.FC<ImportTabProps> = ({ onContentImport, isProcessing = false }) => {
    const [inputValue, setInputValue] = useState("");
    // Auth is handled by the protected layout

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (!inputValue.trim()) {
            return;
        }

        const result: ImportResult = {
            type: 'text',
            content: inputValue,
            metadata: {
                source: 'text_input',
                title: 'Text Content'
            }
        };

        onContentImport(result);
    }, [inputValue, onContentImport]);

    const containerVariants: Variants = useMemo(() => ({
        hidden: { opacity: 0, scale: 0.98, y: 15 },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.06,
                delayChildren: 0.05
            }
        }
    }), []);

    const itemVariants: Variants = useMemo(() => ({
        hidden: { opacity: 0, y: 10, scale: 0.99 },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    }), []);


    return (
        <motion.form 
            className="w-full" 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col space-y-6">
                {/* Main input row */}
                <motion.div 
                    className="flex items-start gap-4"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-foreground/10 backdrop-blur-sm border-2 border-border/80 transition-all duration-300 group-hover:bg-muted/80 group-hover:border-border/60 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.15 }}
                    >
                        <BookOpen className="w-6 h-6 text-foreground" />
                    </motion.div>
                    
                    <div className="flex-1">
                        <motion.div variants={itemVariants}>
                            <Textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="bg-foreground/40 border-2 border-border/90 rounded-xl text-foreground placeholder:text-muted-foreground/70 text-base sm:text-lg resize-none min-h-[120px] p-4 focus:ring-2 focus:ring-ring/60 focus:border-ring/60 transition-all duration-200 backdrop-blur-sm font-geist-mono shadow-sm"
                                placeholder={"Enter your course content here..."}
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Submit button */}
                <motion.div 
                    className="flex justify-end"
                    variants={itemVariants}
                >
                    <motion.button
                        type="submit"
                        disabled={isProcessing}
                            className={cn(
                                "relative px-8 py-3 rounded-xl font-medium text-black",
                                "bg-teal-200 hover:bg-teal-300/90 border-2 border-teal-500",
                                "transition-all duration-300 group overflow-hidden",
                                "shadow-lg hover:shadow-xl hover:border-primary/40",
                                "active:scale-[0.98] font-geist-mono",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        whileHover={{ 
                            scale: isProcessing ? 1 : 1.02,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    >
                        <div className="relative flex items-center justify-center gap-2">
                                <span className="font-medium">
                                    {isProcessing ? 'Processing...' : 'Create Course'}
                                </span>
                            {!isProcessing && (
                                <motion.div
                                    className="flex items-center"
                                    animate={{
                                        x: [0, 3, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                        <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            )}
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </motion.form>
    );
};
