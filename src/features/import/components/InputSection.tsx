import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { ArrowRight, BookOpen, Plus, Video, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';

const placeholderPhrases = [
    "Learn Python programming from scratch",
    "Master digital marketing strategies",
    "Build mobile apps with React Native",
    "Understand machine learning basics",
    "Create stunning UI/UX designs",
];

const InputSection: React.FC = () => {
    const { isDark } = useTheme();
    const [inputValue, setInputValue] = useState("");
    const [placeholderText, setPlaceholderText] = useState("");

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Course creation submitted:', inputValue);
    }, [inputValue]);

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
                    timeoutId = setTimeout(typeText, 80); // Slightly faster
                } else {
                    timeoutId = setTimeout(() => {
                        isDeleting = true;
                        typeText();
                    }, 1500); // Shorter pause
                }
            } else {
                if (currentCharIndex > 0) {
                    setPlaceholderText(currentPhrase.slice(0, currentCharIndex - 1));
                    currentCharIndex--;
                    timeoutId = setTimeout(typeText, 40); // Faster deletion
                } else {
                    isDeleting = false;
                    currentPhraseIndex = (currentPhraseIndex + 1) % placeholderPhrases.length;
                    timeoutId = setTimeout(typeText, 300); // Shorter pause
                }
            }
        };

        typeText();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Optimized animation variants
    const containerVariants = useMemo(() => ({
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

    const itemVariants = useMemo(() => ({
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

    const buttonVariants = useMemo(() => ({
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
            className="w-full px-4 sm:px-6" 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="relative group w-full">
                {/* Enhanced glow effects */}
                <div className={`absolute inset-0 ${
                    isDark 
                        ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/15 to-purple-500/20' 
                        : 'bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10'
                    } rounded-2xl blur-xl ${
                    isDark ? 'opacity-50 group-hover:opacity-70' : 'opacity-30 group-hover:opacity-50'
                    } group-hover:blur-2xl transition-all duration-500`} />
                <div className={`absolute inset-0 ${
                    isDark 
                        ? 'bg-gradient-to-r from-white/5 via-white/10 to-white/5' 
                        : 'bg-gradient-to-r from-gray-200/30 via-gray-100/20 to-gray-200/30'
                    } rounded-2xl blur ${
                    isDark ? 'opacity-60 group-hover:opacity-80' : 'opacity-40 group-hover:opacity-60'
                    } transition-all duration-300`} />
                
                {/* Metallic border effect */}
                <div className={`absolute inset-0 rounded-2xl ${
                    isDark 
                        ? 'bg-gradient-to-r from-gray-400/20 via-white/30 to-gray-400/20 p-[1px] group-hover:from-purple-400/30 group-hover:via-white/40 group-hover:to-blue-400/30' 
                        : 'bg-gradient-to-r from-gray-300/40 via-gray-200/60 to-gray-300/40 p-[1px] group-hover:from-blue-400/40 group-hover:via-gray-300/70 group-hover:to-purple-400/40'
                    } transition-all duration-300`}>
                    <div className={`w-full h-full ${
                        isDark ? 'bg-black/20' : 'bg-white/40'
                        } backdrop-blur-xl rounded-2xl`} />
                </div>
                
                <div className={`relative ${
                    isDark 
                        ? 'bg-black/10 backdrop-blur-2xl border border-white/10 group-hover:border-white/20' 
                        : 'bg-white/60 backdrop-blur-2xl border border-gray-200/50 group-hover:border-gray-300/70'
                    } rounded-2xl shadow-2xl transition-all duration-300`}>
                    <div className="flex flex-col gap-4 p-4 sm:p-6">
                        {/* Main input row */}
                        <motion.div 
                            className="flex items-start gap-3 sm:gap-4"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className={`p-2 rounded-lg ${
                                    isDark 
                                        ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10' 
                                        : 'bg-gradient-to-br from-purple-200/60 to-blue-200/60 border border-purple-300/50'
                                    }`}
                                whileHover={{ scale: 1.03, rotate: 2 }}
                                transition={{ duration: 0.15 }}
                            >
                                <BookOpen className={`w-6 h-6 sm:w-8 sm:h-8 ${
                                    isDark ? 'text-white/90' : 'text-purple-700'
                                    } flex-shrink-0`} />
                            </motion.div>
                            <div className="flex-1">
                                <motion.div variants={itemVariants}>
                                    <Textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className={`${
                                            isDark 
                                                ? 'bg-black/20 border border-white/10 text-white placeholder:text-white/50 focus:ring-purple-400/50 focus:border-purple-400/50' 
                                                : 'bg-white/60 border border-gray-200/50 text-gray-900 placeholder:text-gray-500 focus:ring-blue-400/50 focus:border-blue-400/50'
                                            } rounded-xl text-base sm:text-lg resize-none min-h-[100px] p-4 focus:ring-2 transition-all duration-200 backdrop-blur-sm`}
                                        placeholder={`create course for ${placeholderText}`}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Import buttons and submit button */}
                        <motion.div 
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="flex flex-wrap gap-2"
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
                                        className={`${
                                            isDark 
                                                ? 'bg-black/20 border border-white/20 text-white hover:bg-white/10 hover:border-white/30' 
                                                : 'bg-white/40 border border-gray-200/50 text-gray-700 hover:bg-white/60 hover:border-gray-300/70'
                                            } transition-all duration-200 gap-2 backdrop-blur-sm`}
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
                                        className={`${
                                            isDark 
                                                ? 'bg-black/20 border border-white/20 text-white hover:bg-white/10 hover:border-white/30' 
                                                : 'bg-white/40 border border-gray-200/50 text-gray-700 hover:bg-white/60 hover:border-gray-300/70'
                                            } transition-all duration-200 gap-2 backdrop-blur-sm`}
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
                                        className={`${
                                            isDark 
                                                ? 'bg-black/20 border border-white/20 text-white hover:bg-white/10 hover:border-white/30' 
                                                : 'bg-white/40 border border-gray-200/50 text-gray-700 hover:bg-white/60 hover:border-gray-300/70'
                                            } transition-all duration-200 gap-2 backdrop-blur-sm`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        More
                                    </Button>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={buttonVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="lg"
                                    type="submit"
                                    className={`w-full sm:w-auto ${
                                        isDark 
                                            ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white border border-white/20' 
                                            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border border-purple-600'
                                        } shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl group backdrop-blur-sm`}
                                >
                                    <span className="mr-2 font-semibold">Create Course</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.form>
    );
};

export default React.memo(InputSection);