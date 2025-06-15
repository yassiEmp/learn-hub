import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Trophy, 
  Zap, 
  ArrowRight, 
  Play,
  Star,
  Globe,
  Brain,
  Target,
  Rocket,
  ChevronDown
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  accent: string;
  bgGradient: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Welcome to LearnHub',
    subtitle: 'Your AI-Powered Learning Journey Begins',
    description: 'Transform the way you learn with our intelligent course creation platform. Build, share, and master skills faster than ever before.',
    features: [
      'AI-powered course generation',
      'Personalized learning paths',
      'Interactive content creation',
      'Real-time progress tracking'
    ],
    accent: 'from-purple-400 to-pink-400',
    bgGradient: 'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)'
  },
  {
    id: 'create',
    icon: <Brain className="w-6 h-6" />,
    title: 'Create with Intelligence',
    subtitle: 'AI That Understands Your Vision',
    description: 'Simply describe what you want to learn or teach. Our AI transforms your ideas into comprehensive, engaging courses in minutes.',
    features: [
      'Natural language processing',
      'Automatic content structuring',
      'Multi-format support',
      'Smart recommendations'
    ],
    accent: 'from-blue-400 to-cyan-400',
    bgGradient: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
  },
  {
    id: 'learn',
    icon: <Target className="w-6 h-6" />,
    title: 'Learn Effectively',
    subtitle: 'Adaptive Learning That Evolves',
    description: 'Experience personalized learning that adapts to your pace, style, and goals. Every lesson is optimized for maximum retention.',
    features: [
      'Adaptive difficulty scaling',
      'Spaced repetition system',
      'Interactive assessments',
      'Performance analytics'
    ],
    accent: 'from-green-400 to-emerald-400',
    bgGradient: 'radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)'
  },
  {
    id: 'achieve',
    icon: <Rocket className="w-6 h-6" />,
    title: 'Achieve Excellence',
    subtitle: 'Unlock Your Full Potential',
    description: 'Join thousands of learners who have transformed their careers and achieved their goals through our platform.',
    features: [
      'Industry certifications',
      'Career advancement tracking',
      'Community networking',
      'Expert mentorship'
    ],
    accent: 'from-orange-400 to-red-400',
    bgGradient: 'radial-gradient(circle at 60% 30%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)'
  }
];

const WordByWordText: React.FC<{ 
  text: string; 
  className?: string; 
  delay?: number;
  isVisible: boolean;
  shouldStayVisible: boolean;
}> = ({ text, className = '', delay = 0, isVisible, shouldStayVisible }) => {
  const words = text.split(' ');
  
  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ 
            opacity: 0, 
            y: 20, 
            filter: 'blur(10px)',
            scale: 0.8
          }}
          animate={(isVisible || shouldStayVisible) ? { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            scale: 1
          } : {
            opacity: 0, 
            y: 20, 
            filter: 'blur(10px)',
            scale: 0.8
          }}
          transition={{
            duration: 0.6,
            delay: isVisible ? delay + (index * 0.1) : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const FeatureItem: React.FC<{ 
  feature: string; 
  index: number; 
  delay: number;
  isVisible: boolean;
  shouldStayVisible: boolean;
}> = ({ feature, index, delay, isVisible, shouldStayVisible }) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      x: -30, 
      filter: 'blur(5px)' 
    }}
    animate={(isVisible || shouldStayVisible) ? { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)' 
    } : {
      opacity: 0, 
      x: -30, 
      filter: 'blur(5px)' 
    }}
    transition={{
      duration: 0.6,
      delay: isVisible ? delay + (index * 0.1) : 0,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 120,
      damping: 20
    }}
    className="flex items-center space-x-3 group"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 360 }}
      transition={{ duration: 0.3 }}
      className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition-colors duration-300 flex-shrink-0"
    />
    <span className="text-white/80 group-hover:text-white transition-colors duration-300 font-geist-mono text-sm">
      {feature}
    </span>
  </motion.div>
);

const ScrollIndicator: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
    transition={{ duration: 0.6, delay: 2.5 }}
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2"
  >
    <span className="font-geist-mono text-white/50 text-xs">Scroll to explore</span>
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center"
    >
      <ChevronDown className="w-3 h-3 text-white/50" />
    </motion.div>
  </motion.div>
);

export const OnboardingLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [sectionVisibility, setSectionVisibility] = useState<boolean[]>([true, false, false, false]);
  const [animatedSections, setAnimatedSections] = useState<Set<number>>(new Set([0]));

  const { scrollY } = useScroll({
    container: containerRef
  });

  // Calculate which section should be visible based on scroll position
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      const viewportHeight = window.innerHeight;
      const scrollProgress = latest / viewportHeight;
      
      // Determine current section (0-3)
      const newStep = Math.min(Math.floor(scrollProgress), onboardingSteps.length - 1);
      
      // Update current step
      if (newStep !== currentStep) {
        setCurrentStep(newStep);
      }

      // Calculate visibility for each section
      const newVisibility = onboardingSteps.map((_, index) => {
        const sectionStart = index * viewportHeight;
        const sectionEnd = (index + 1) * viewportHeight;
        const sectionCenter = sectionStart + (viewportHeight * 0.3); // Trigger at 30% into section
        
        return latest >= sectionCenter && latest < sectionEnd + (viewportHeight * 0.2);
      });

      setSectionVisibility(newVisibility);

      // Track which sections have been animated
      setAnimatedSections(prev => {
        const newSet = new Set(prev);
        newVisibility.forEach((isVisible, index) => {
          if (isVisible) {
            newSet.add(index);
          }
        });
        return newSet;
      });
    });

    return unsubscribe;
  }, [scrollY, currentStep]);

  const currentStepData = onboardingSteps[currentStep];

  // Background transform based on scroll
  const backgroundY = useTransform(scrollY, [0, 1200], [0, -200]);
  const backgroundOpacity = useTransform(scrollY, [0, 300, 600, 900, 1200], [1, 0.8, 0.6, 0.4, 0.2]);

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Fixed Background with scroll-based animation */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY, opacity: backgroundOpacity }}
      >
        <motion.div
          animate={{
            background: currentStepData.bgGradient
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Fixed Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 lg:p-6"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-gray-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-syne font-semibold text-white">LearnHub</h1>
          </motion.div>
          
          {/* Step Indicators */}
          <div className="flex items-center space-x-2">
            {onboardingSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentStep
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/30'
                }`}
                animate={{
                  scale: index === currentStep ? 1.25 : 1,
                  opacity: index === currentStep ? 1 : 0.3
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.header>

      {/* Scrollable Content Container */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Each section takes full viewport height */}
        {onboardingSteps.map((step, index) => {
          const isCurrentlyVisible = sectionVisibility[index];
          const hasBeenAnimated = animatedSections.has(index);
          const shouldStayVisible = hasBeenAnimated && !isCurrentlyVisible;

          return (
            <section
              key={step.id}
              className="h-screen flex items-center justify-center px-4 lg:px-6 relative"
            >
              <div className="max-w-6xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column - Content */}
                  <div className="space-y-4 lg:space-y-6">
                    <div className="space-y-4 lg:space-y-5">
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={(isCurrentlyVisible || shouldStayVisible) ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: isCurrentlyVisible ? 0.2 : 0,
                          type: "spring",
                          stiffness: 150,
                          damping: 15
                        }}
                        className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br ${step.accent} p-3 shadow-sm`}
                      >
                        {step.icon}
                      </motion.div>

                      {/* Title */}
                      <div className="space-y-2 lg:space-y-3">
                        <h2 className="font-syne font-semibold text-white text-3xl lg:text-4xl xl:text-5xl leading-tight">
                          <WordByWordText 
                            text={step.title} 
                            delay={0.3} 
                            isVisible={isCurrentlyVisible}
                            shouldStayVisible={shouldStayVisible}
                          />
                        </h2>
                        
                        <p className="font-geist-mono text-white/60 text-base lg:text-lg">
                          <WordByWordText 
                            text={step.subtitle} 
                            delay={0.8} 
                            isVisible={isCurrentlyVisible}
                            shouldStayVisible={shouldStayVisible}
                          />
                        </p>
                      </div>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={(isCurrentlyVisible || shouldStayVisible) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: isCurrentlyVisible ? 1.2 : 0 }}
                        className="font-geist-mono text-white/70 text-sm lg:text-base leading-relaxed max-w-lg"
                      >
                        {step.description}
                      </motion.p>

                      {/* Features */}
                      <div className="space-y-2 lg:space-y-3">
                        {step.features.map((feature, featureIndex) => (
                          <FeatureItem
                            key={feature}
                            feature={feature}
                            index={featureIndex}
                            delay={1.5}
                            isVisible={isCurrentlyVisible}
                            shouldStayVisible={shouldStayVisible}
                          />
                        ))}
                      </div>

                      {/* CTA Button - Only show on last step */}
                      {index === onboardingSteps.length - 1 && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={(isCurrentlyVisible || shouldStayVisible) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ duration: 0.6, delay: isCurrentlyVisible ? 2.0 : 0 }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: '0 10px 40px rgba(255, 255, 255, 0.1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="group flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-gray-800 rounded-xl text-white hover:bg-white/15 transition-all duration-300 shadow-sm"
                        >
                          <span className="font-geist-mono font-medium text-sm">
                            Get Started
                          </span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Visual */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={(isCurrentlyVisible || shouldStayVisible) ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
                      transition={{ duration: 0.8, delay: isCurrentlyVisible ? 0.5 : 0 }}
                      className="relative"
                    >
                      {/* Glass Card */}
                      <div className="relative p-6 lg:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-gray-800 shadow-sm overflow-hidden">
                        {/* Animated gradient overlay */}
                        <motion.div
                          animate={{
                            background: [
                              `linear-gradient(45deg, ${step.accent.replace('from-', 'rgba(').replace(' to-', ', 0.1) 0%, rgba(').replace('-400', ', 0.1)')} 100%)`,
                              `linear-gradient(135deg, ${step.accent.replace('from-', 'rgba(').replace(' to-', ', 0.05) 0%, rgba(').replace('-400', ', 0.15)')} 100%)`,
                              `linear-gradient(45deg, ${step.accent.replace('from-', 'rgba(').replace(' to-', ', 0.1) 0%, rgba(').replace('-400', ', 0.1)')} 100%)`
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0"
                        />
                        
                        {/* Content */}
                        <div className="relative z-10 text-center space-y-4 lg:space-y-5">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center"
                          >
                            <Globe className="w-8 h-8 lg:w-10 lg:h-10 text-white/80" />
                          </motion.div>
                          
                          <div className="space-y-2 lg:space-y-3">
                            <h3 className="font-syne font-semibold text-white text-xl lg:text-2xl">
                              Join 50,000+ Learners
                            </h3>
                            <p className="font-geist-mono text-white/60 text-sm">
                              Transform your career with AI-powered learning
                            </p>
                          </div>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3 lg:gap-4 pt-4">
                            {[
                              { icon: Users, value: '50K+', label: 'Students' },
                              { icon: BookOpen, value: '1K+', label: 'Courses' },
                              { icon: Trophy, value: '95%', label: 'Success' }
                            ].map((stat, statIndex) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={(isCurrentlyVisible || shouldStayVisible) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: isCurrentlyVisible ? 1.0 + (statIndex * 0.1) : 0 }}
                                className="text-center space-y-1 lg:space-y-2"
                              >
                                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white/60 mx-auto" />
                                <div className="font-syne font-semibold text-white text-base lg:text-lg">
                                  {stat.value}
                                </div>
                                <div className="font-geist-mono text-white/50 text-xs">
                                  {stat.label}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator - Only show on first section */}
              {index === 0 && <ScrollIndicator isVisible={currentStep === 0} />}
            </section>
          );
        })}
      </div>

      {/* Fixed Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-gray-800 rounded-full">
          <span className="font-geist-mono text-white/50 text-xs">
            {currentStep + 1} of {onboardingSteps.length}
          </span>
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};