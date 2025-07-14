import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowRight, BookOpen, Plus, Video, Image } from 'lucide-react';
import { motion , Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const placeholderPhrases = [
    "Learning Python programming from scratch",
    "Mastering digital marketing strategies",
    "Building mobile apps with React Native",
    "Understanding machine learning basics",
    "Creating stunning UI/UX designs",
];

const InputSection: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [placeholderText, setPlaceholderText] = useState("");
    const { session } = useAuth();
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/api/v1/course",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                text: inputValue,
                style: "chunk",
                title: "default",
                description: "default",
                category: "default",
                level: "default",
                price: 0,
                tags: ["default"]
            })
        })
          
        const data = await response.json()
        console.log(data)

        console.log('Course creation submitted:', inputValue);
    }, [inputValue, session]);

    // Optimized typing effect
    useEffect(() => {
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let timeoutId: NodeJS.Timeout;

        const typeText = () => {
            const currentPhrase = placeholderPhrases[currentPhraseIndex];

            if (!isDeleting) {
                if (currentCharIndex < currentPhrase.length) {
                    setPlaceholderText(currentPhrase.slice(0, currentCharIndex + 1));
                    currentCharIndex++;
                    timeoutId = setTimeout(typeText, 80);
                } else {
                    timeoutId = setTimeout(() => {
                        isDeleting = true;
                        typeText();
                    }, 1500);
                }
            } else {
                if (currentCharIndex > 0) {
                    setPlaceholderText(currentPhrase.slice(0, currentCharIndex - 1));
                    currentCharIndex--;
                    timeoutId = setTimeout(typeText, 40);
                } else {
                    isDeleting = false;
                    currentPhraseIndex = (currentPhraseIndex + 1) % placeholderPhrases.length;
                    timeoutId = setTimeout(typeText, 300);
                }
            }
        };

        typeText();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const containerVariants : Variants= useMemo(() => ({
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

    const itemVariants : Variants= useMemo(() => ({
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

    const buttonVariants : Variants= useMemo(() => ({
        hidden: { opacity: 0, scale: 0.95, y: 5 },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { 
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    }), []);

    return (
        <motion.form 
            className="w-full px-4 sm:p-6 min-h-fit" 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="relative group w-full max-w-4xl mx-auto">
                {/* Glass card */}
                <div
                    className={cn(
                        "relative p-6 sm:p-8 rounded-2xl overflow-hidden transition-all duration-300",
                        "border border-white/10 bg-black/40 backdrop-blur-xl",
                        "hover:border-white/20 hover:-translate-y-1 will-change-transform"
                    )}
                >
                    {/* Subtle dot pattern background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:8px_8px]" />
                    </div>

                    <div className="relative flex flex-col space-y-6">
                        {/* Main input row */}
                        <motion.div 
                            className="flex items-start gap-4"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/15"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.15 }}
                            >
                                <BookOpen className="w-6 h-6 text-white/90" />
                            </motion.div>
                            
                            <div className="flex-1">
                                <motion.div variants={itemVariants}>
                                    <Textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 text-base sm:text-lg resize-none min-h-[120px] p-4 focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200 backdrop-blur-sm font-geist-mono"
                                        placeholder={`Create course for ${placeholderText}`}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Import buttons and submit button */}
                        <motion.div 
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="flex flex-wrap gap-3"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.04,
                                            delayChildren: 0.05
                                        }
                                    }
                                }}
                            >
                                <motion.div variants={buttonVariants}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 gap-2 backdrop-blur-sm text-sm font-geist-mono"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <Video className="w-4 h-4" />
                                        Video
                                    </Button>
                                </motion.div>
                                <motion.div variants={buttonVariants}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 gap-2 backdrop-blur-sm text-sm font-geist-mono"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <Image className="w-4 h-4" />
                                        Image
                                    </Button>
                                </motion.div>
                                <motion.div variants={buttonVariants}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 gap-2 backdrop-blur-sm text-sm font-geist-mono"
                                    >
                                        <Plus className="w-4 h-4" />
                                        More
                                    </Button>
                                </motion.div>
                            </motion.div>

                            {/* Enhanced Create Course Button */}
                            <motion.div
                                variants={buttonVariants}
                                className="relative"
                            >
                                <motion.button
                                    type="submit"
                                    className={cn(
                                        "relative px-8 py-3 rounded-xl font-medium text-black",
                                        "bg-white hover:bg-white/90",
                                        "transition-all duration-300 group overflow-hidden",
                                        "shadow-lg hover:shadow-xl",
                                        "active:scale-[0.98] w-full sm:w-auto font-geist-mono"
                                    )}
                                    whileHover={{ 
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                >
                                    {/* Button content */}
                                    <div className="relative flex items-center justify-center gap-2">
                                        <span className="font-medium">
                                            Create Course
                                        </span>
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
                                    </div>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.form>
    );
};

export default React.memo(InputSection);