import React, { Suspense, lazy } from 'react';
import { StarBorder } from './ui/StarBorder';
import { Sparkles, BookOpen, Zap, Users, Trophy, Clock, Brain, Target, CheckCircle, ArrowRight, Star, Play, Heart, Eye, Download, Code, Database, Palette, Smartphone, Settings, Globe, Shield, Rocket, Award, TrendingUp, BarChart3, Lightbulb, Layers } from 'lucide-react';
import Title from '../features/import/components/Title';
import InputSection from '../features/import/components/InputSection';
import { motion } from 'framer-motion';

// Lazy load ChromeGrid for better initial performance
const ChromeGrid = lazy(() => import('./ui/ChromeGrid').then(module => ({ default: module.ChromeGrid })));

// Loading fallback for ChromeGrid
const ChromeGridFallback = () => (
  <div className="h-full w-full bg-gray-100 dark:bg-black relative z-0 pointer-events-none transition-colors duration-200" />
);

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return Code;
    case 'data science':
      return Database;
    case 'design':
      return Palette;
    case 'mobile':
      return Smartphone;
    case 'backend':
      return Settings;
    case 'marketing':
      return Target;
    default:
      return BookOpen;
  }
};

// Category color mapping
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return 'from-blue-500 to-cyan-500';
    case 'data science':
      return 'from-green-500 to-emerald-500';
    case 'design':
      return 'from-purple-500 to-pink-500';
    case 'mobile':
      return 'from-orange-500 to-red-500';
    case 'backend':
      return 'from-gray-500 to-slate-500';
    case 'marketing':
      return 'from-yellow-500 to-orange-500';
    default:
      return 'from-indigo-500 to-blue-500';
  }
};

export const ImportPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
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
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const featureVariants = {
    hidden: { 
      opacity: 0, 
      y: 12,
      scale: 0.96
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

  // Optimized community courses data without external images
  const communityCoursesData = React.useMemo(() => [
    {
      id: 1,
      title: "Advanced React Patterns",
      author: "Sarah Chen",
      authorAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
      category: "Web Development",
      rating: 4.9,
      students: 2847,
      duration: "8h 30m",
      lessons: 24,
      likes: 156,
      views: 8924,
      isNew: true,
      tags: ["React", "JavaScript", "Advanced"]
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      author: "Dr. Alex Kumar",
      authorAvatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
      category: "Data Science",
      rating: 4.8,
      students: 1923,
      duration: "12h 15m",
      lessons: 36,
      likes: 203,
      views: 5672,
      isTrending: true,
      tags: ["Python", "ML", "AI"]
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      author: "Emma Rodriguez",
      authorAvatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
      category: "Design",
      rating: 4.7,
      students: 3156,
      duration: "6h 45m",
      lessons: 18,
      likes: 289,
      views: 12453,
      isPopular: true,
      tags: ["Figma", "Design", "UX"]
    },
    {
      id: 4,
      title: "Node.js Backend Development",
      author: "Michael Thompson",
      authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
      category: "Backend",
      rating: 4.9,
      students: 1847,
      duration: "10h 20m",
      lessons: 28,
      likes: 178,
      views: 6891,
      tags: ["Node.js", "Express", "MongoDB"]
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      author: "Lisa Park",
      authorAvatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
      category: "Marketing",
      rating: 4.6,
      students: 2134,
      duration: "7h 30m",
      lessons: 22,
      likes: 145,
      views: 4567,
      tags: ["SEO", "Social Media", "Analytics"]
    },
    {
      id: 6,
      title: "Mobile App Development",
      author: "James Wilson",
      authorAvatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
      category: "Mobile",
      rating: 4.8,
      students: 1654,
      duration: "14h 10m",
      lessons: 42,
      likes: 234,
      views: 7823,
      tags: ["React Native", "Flutter", "iOS"]
    }
  ], []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* ChromeGrid Background with Suspense */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<ChromeGridFallback />}>
          <ChromeGrid />
        </Suspense>
      </div>

      {/* Content Overlay */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center w-full min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl w-full flex flex-col justify-center gap-2 md:gap-4 items-center">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
            <motion.div variants={itemVariants}>
              <StarBorder 
                as="div"
                color="#fbbf24"
                speed="4s"
                className="w-fit"
              >
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm sm:text-base font-medium text-white font-unbounded tracking-wide">optimized-learn</span>
                </div>
              </StarBorder>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Title />
            </motion.div>

            <motion.h2 
              className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-white/90 w-full sm:w-[90%] md:w-[80%] mx-auto leading-relaxed font-light drop-shadow-lg font-unbounded transition-colors duration-200"
              variants={itemVariants}
            >
              Transform your ideas into comprehensive courses in minutes. Just describe what you want to teach, and let
              AI do the rest.
            </motion.h2>
          </div>

          {/* Input Section */}
          <motion.div variants={itemVariants} className="w-full">
            <InputSection />
          </motion.div>

          {/* Ultra-Translucent Feature Cards - Hidden on mobile */}
          <motion.div 
            className="hidden sm:grid grid-cols-3 gap-6 w-[85%]"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Generate courses in minutes",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                desc: "Smart content generation",
              },
              {
                icon: BookOpen,
                title: "Professional",
                desc: "Industry-standard quality",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden"
                variants={featureVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.15 }
                }}
              >
                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-200/20 dark:from-white/5 via-gray-100/10 dark:via-white/2 to-gray-200/20 dark:to-white/5 p-[0.5px] group-hover:from-purple-400/20 group-hover:via-gray-200/20 dark:group-hover:via-white/10 group-hover:to-blue-400/20 transition-all duration-500">
                  <div className="w-full h-full bg-transparent rounded-xl" />
                </div>
                
                {/* Minimal glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/3 group-hover:to-purple-500/5 transition-all duration-500 blur-2xl" />
                
                {/* Ultra-translucent card content */}
                <div className="relative bg-white/60 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-white/5 hover:border-gray-300/70 dark:hover:border-white/15 transition-all duration-500 shadow-lg hover:shadow-purple-500/5 max-h-[200px] min-w-[150px] group-hover:bg-white/70 dark:group-hover:bg-black/15">
                  {/* Minimalist icon container */}
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto bg-gray-100/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 group-hover:border-gray-300/70 dark:group-hover:border-white/20 transition-all duration-300 group-hover:bg-gray-200/60 dark:group-hover:bg-white/10"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <feature.icon className="w-6 h-6 text-gray-600 dark:text-white/80 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  
                  <h3 className="text-gray-800 dark:text-white/90 font-semibold text-sm mb-3 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 font-unbounded">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed font-light group-hover:text-gray-700 dark:group-hover:text-white/75 transition-colors duration-300 font-unbounded">{feature.desc}</p>
                  
                  {/* Subtle accent line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[0.5px] bg-gradient-to-r from-transparent via-gray-400/40 dark:via-white/20 to-transparent group-hover:w-2/3 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* New Platform Showcase Section */}
      <motion.div 
        className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-white/80 dark:bg-transparent transition-colors duration-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-200/50 dark:border-white/20 backdrop-blur-sm mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-white/90 font-medium font-unbounded text-sm">Trusted Worldwide</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-unbounded">
              Join the
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Learning Revolution
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
              Discover why educators and learners from 150+ countries choose LearnHub to transform their teaching and learning experience
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.5
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Users,
                value: "2.5M+",
                label: "Active Learners",
                color: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: BookOpen,
                value: "150K+",
                label: "Courses Created",
                color: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Award,
                value: "98%",
                label: "Success Rate",
                color: "from-green-500/20 to-emerald-500/20"
              },
              {
                icon: Globe,
                value: "150+",
                label: "Countries",
                color: "from-orange-500/20 to-red-500/20"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { duration: 0.5 }
                  }
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Card background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/50 dark:from-white/5 via-gray-50/30 dark:via-white/2 to-gray-100/50 dark:to-white/5 p-[1px] group-hover:from-gray-200/70 dark:group-hover:from-white/10 group-hover:via-gray-100/50 dark:group-hover:via-white/5 group-hover:to-gray-200/70 dark:group-hover:to-white/10 transition-all duration-300">
                  <div className="w-full h-full bg-white/80 dark:bg-black/20 backdrop-blur-xl rounded-2xl" />
                </div>
                
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-40 transition-all duration-300 blur-xl`} />
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} border border-gray-200/50 dark:border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:border-gray-300/70 dark:group-hover:border-white/20 transition-all duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-8 h-8 text-gray-700 dark:text-white/90" />
                  </motion.div>
                  
                  <motion.div 
                    className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 font-unbounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-gray-600 dark:text-white/70 font-medium font-unbounded">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Showcase */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* Left side - Features list */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 font-unbounded">
                  Everything you need to succeed
                </h3>
                <p className="text-gray-600 dark:text-white/70 text-lg leading-relaxed mb-8">
                  From AI-powered content generation to advanced analytics, we provide all the tools you need to create, share, and optimize your learning experience.
                </p>
              </motion.div>

              <motion.div 
                className="space-y-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.9
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {[
                  {
                    icon: Brain,
                    title: "Smart AI Assistant",
                    description: "Get intelligent suggestions and automated content generation powered by advanced AI"
                  },
                  {
                    icon: BarChart3,
                    title: "Advanced Analytics",
                    description: "Track progress, engagement, and learning outcomes with detailed insights and reports"
                  },
                  {
                    icon: Shield,
                    title: "Enterprise Security",
                    description: "Bank-level security with end-to-end encryption and compliance certifications"
                  },
                  {
                    icon: Rocket,
                    title: "Lightning Performance",
                    description: "Optimized for speed with global CDN and edge computing for instant access"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 group"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: { duration: 0.4 }
                      }
                    }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100/50 dark:from-white/10 to-gray-50/30 dark:to-white/5 border border-gray-200/50 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-gray-300/70 dark:group-hover:border-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-6 h-6 text-gray-600 dark:text-white/80 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-semibold text-lg mb-2 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200 font-unbounded">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-white/70 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-white/85 transition-colors duration-200">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right side - Interactive showcase */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Main showcase card */}
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 rounded-3xl blur-2xl" />
                
                {/* Card */}
                <div className="relative bg-white/80 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-gray-200/50 dark:border-white/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-gray-700 dark:text-white/90" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold font-unbounded">Course Analytics</h4>
                        <p className="text-gray-600 dark:text-white/60 text-sm">Real-time insights</p>
                      </div>
                    </div>
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">+24% this week</div>
                  </div>
                  
                  {/* Mock chart */}
                  <div className="space-y-4 mb-6">
                    {[
                      { label: "Completion Rate", value: 87, color: "bg-green-500" },
                      { label: "Engagement", value: 92, color: "bg-blue-500" },
                      { label: "Satisfaction", value: 95, color: "bg-purple-500" }
                    ].map((metric, index) => (
                      <motion.div 
                        key={index}
                        className="space-y-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-white/80">{metric.label}</span>
                          <span className="text-gray-900 dark:text-white font-medium">{metric.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200/50 dark:bg-white/10 rounded-full h-2">
                          <motion.div 
                            className={`${metric.color} h-2 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button 
                      className="flex-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button 
                      className="bg-gray-100/50 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 text-gray-700 dark:text-white p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-white/20 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl border border-gray-200/50 dark:border-white/10 backdrop-blur-sm flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </motion.div>

              <motion.div 
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl border border-gray-200/50 dark:border-white/10 backdrop-blur-sm flex items-center justify-center"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600/80 to-teal-600/80 border border-emerald-200/50 dark:border-white/20 backdrop-blur-sm hover:from-emerald-500/90 hover:to-teal-500/90 transition-all duration-200 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <Rocket className="w-5 h-5 text-white" />
              <span className="text-white font-semibold font-unbounded">Experience the Platform</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </motion.div>
            
            <p className="text-gray-600 dark:text-white/60 text-sm mt-4 font-unbounded">
              Join thousands of educators already transforming education
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* New Benefits Section */}
      <motion.div 
        className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gray-50/80 dark:bg-transparent transition-colors duration-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-200/50 dark:border-white/20 backdrop-blur-sm mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
            >
              <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-purple-800 dark:text-white/90 font-medium font-unbounded text-sm">Why Choose LearnHub</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-unbounded">
              The Future of
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                Learning is Here
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of educators and learners who are already transforming education with AI-powered course creation
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.5
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Brain,
                title: "AI-Powered Intelligence",
                description: "Our advanced AI understands your teaching goals and creates structured, engaging content that resonates with your audience.",
                stats: "95% accuracy",
                color: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Clock,
                title: "Save 10x Time",
                description: "What used to take weeks now takes minutes. Focus on teaching while AI handles the heavy lifting of content creation.",
                stats: "10x faster",
                color: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: Target,
                title: "Precision Learning",
                description: "Every course is tailored to specific learning objectives with adaptive content that meets your students exactly where they are.",
                stats: "100% personalized",
                color: "from-green-500/20 to-emerald-500/20"
              },
              {
                icon: Users,
                title: "Proven Results",
                description: "Join 50,000+ educators who've seen 3x better student engagement and completion rates with AI-generated courses.",
                stats: "50k+ educators",
                color: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: Sparkles,
                title: "Professional Quality",
                description: "Industry-standard course structure, multimedia integration, and assessment tools that rival top educational institutions.",
                stats: "Enterprise-grade",
                color: "from-violet-500/20 to-purple-500/20"
              },
              {
                icon: Trophy,
                title: "Measurable Impact",
                description: "Track student progress, engagement metrics, and learning outcomes with built-in analytics and reporting tools.",
                stats: "Real-time insights",
                color: "from-yellow-500/20 to-orange-500/20"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.98 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { duration: 0.4 }
                  }
                }}
                whileHover={{ 
                  scale: 1.01,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Card background with gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/50 dark:from-white/5 via-gray-50/30 dark:via-white/2 to-gray-100/50 dark:to-white/5 p-[1px] group-hover:from-gray-200/70 dark:group-hover:from-white/10 group-hover:via-gray-100/50 dark:group-hover:via-white/5 group-hover:to-gray-200/70 dark:group-hover:to-white/10 transition-all duration-300">
                  <div className="w-full h-full bg-white/80 dark:bg-black/20 backdrop-blur-xl rounded-2xl" />
                </div>
                
                {/* Subtle glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-30 transition-all duration-300 blur-xl`} />
                
                {/* Card content */}
                <div className="relative p-8 h-full">
                  {/* Icon and stats */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} border border-gray-200/50 dark:border-white/10 flex items-center justify-center group-hover:border-gray-300/70 dark:group-hover:border-white/20 transition-all duration-300`}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.4 }}
                    >
                      <benefit.icon className="w-7 h-7 text-gray-700 dark:text-white/90" />
                    </motion.div>
                    
                    <motion.div 
                      className="text-right"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    >
                      <div className="text-xs text-gray-500 dark:text-white/60 font-unbounded uppercase tracking-wider">Impact</div>
                      <div className="text-sm font-bold text-gray-800 dark:text-white/90 font-unbounded">{benefit.stats}</div>
                    </motion.div>
                  </div>
                  
                  {/* Title and description */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200 font-unbounded">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-white/85 transition-colors duration-200 font-light">
                    {benefit.description}
                  </p>
                  
                  {/* Subtle accent line */}
                  <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-gray-400/40 dark:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 border border-purple-200/50 dark:border-white/20 backdrop-blur-sm hover:from-purple-500/90 hover:to-blue-500/90 transition-all duration-200 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-white font-semibold font-unbounded">Start Creating Your First Course</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </motion.div>
            
            <p className="text-gray-600 dark:text-white/60 text-sm mt-4 font-unbounded">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Community Courses Section */}
      <motion.div 
        className="relative z-20 w-[90%] sm:w-[85%] md:w-[80%] min-h-[600px] h-fit mx-auto mb-8"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5,
          delay: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {/* Enhanced border effect */}
        <div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-gray-200/40 dark:from-white/8 via-gray-100/20 dark:via-white/4 to-gray-200/40 dark:to-white/8 p-[1px]">
          <div className="w-full h-full bg-transparent rounded-[15px]" />
        </div>
        
        {/* Enhanced translucent content */}
        <div className="relative bg-white/70 dark:bg-black/15 backdrop-blur-xl rounded-[16px] border border-gray-200/50 dark:border-white/15 shadow-2xl overflow-hidden">
          {/* Enhanced header */}
          <motion.div 
            className="w-full h-16 sm:h-20 border-b border-gray-200/50 dark:border-white/15 bg-gradient-to-r from-gray-100/40 dark:from-white/8 via-gray-50/20 dark:via-white/4 to-gray-100/40 dark:to-white/8 relative"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-gray-200/50 dark:border-white/20 flex items-center justify-center"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.4 }}
                >
                  <Users className="w-5 h-5 text-gray-700 dark:text-white/90" />
                </motion.div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white/95 font-unbounded">
                    Community Courses
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-white/70 font-unbounded">
                    Discover amazing courses shared by our community
                  </p>
                </div>
              </div>
              
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100/50 dark:bg-white/10 border border-gray-200/50 dark:border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <Eye className="w-4 h-4 text-gray-600 dark:text-white/80" />
                <span className="text-sm text-gray-800 dark:text-white/90 font-unbounded">24.5k views today</span>
              </motion.div>
            </div>
            
            {/* Enhanced accent */}
            <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gray-400/50 dark:via-white/25 to-transparent" />
          </motion.div>
          
          {/* Enhanced content area */}
          <motion.div 
            className="p-6 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            {/* Community courses grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {communityCoursesData.map((course, index) => {
                const CategoryIcon = getCategoryIcon(course.category);
                const categoryColor = getCategoryColor(course.category);
                
                return (
                  <motion.div 
                    key={course.id} 
                    className="group relative overflow-hidden rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:border-gray-300/70 dark:hover:border-white/20 transition-all duration-300 cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, scale: 0.96, y: 10 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        y: 0,
                        transition: { duration: 0.3 }
                      }
                    }}
                    whileHover={{ 
                      scale: 1.01,
                      y: -3,
                      transition: { duration: 0.15 }
                    }}
                  >
                    {/* Course thumbnail replacement with gradient and icon */}
                    <div className="relative h-40 overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-br ${categoryColor} relative`}>
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                        </div>
                        
                        {/* Category icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                            <CategoryIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay with play button */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </motion.div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {course.isNew && (
                          <span className="px-2 py-1 text-xs font-bold bg-green-500/80 text-white rounded-full backdrop-blur-sm">
                            NEW
                          </span>
                        )}
                        {course.isTrending && (
                          <span className="px-2 py-1 text-xs font-bold bg-orange-500/80 text-white rounded-full backdrop-blur-sm">
                            TRENDING
                          </span>
                        )}
                        {course.isPopular && (
                          <span className="px-2 py-1 text-xs font-bold bg-purple-500/80 text-white rounded-full backdrop-blur-sm">
                            POPULAR
                          </span>
                        )}
                      </div>
                      
                      {/* Category */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white/90 rounded-full backdrop-blur-sm border border-white/20">
                          {course.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Course info */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-gray-900 dark:text-white/95 font-bold text-lg mb-2 line-clamp-2 group-hover:text-gray-800 dark:group-hover:text-white transition-colors font-unbounded">
                        {course.title}
                      </h3>
                      
                      {/* Author */}
                      <div className="flex items-center gap-2 mb-3">
                        <img 
                          src={course.authorAvatar} 
                          alt={course.author}
                          className="w-6 h-6 rounded-full border border-gray-200/50 dark:border-white/20"
                          loading="lazy"
                        />
                        <span className="text-gray-600 dark:text-white/70 text-sm font-medium">{course.author}</span>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-white/60">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {course.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-2 py-1 text-xs bg-gray-100/60 dark:bg-white/10 text-gray-700 dark:text-white/80 rounded-full border border-gray-200/50 dark:border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.button 
                            className="flex items-center gap-1 text-gray-500 dark:text-white/70 hover:text-gray-700 dark:hover:text-white transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{course.likes}</span>
                          </motion.button>
                          
                          <motion.button 
                            className="flex items-center gap-1 text-gray-500 dark:text-white/70 hover:text-gray-700 dark:hover:text-white transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Save</span>
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center gap-1 text-gray-500 dark:text-white/60 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>{course.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* View more button */}
            <motion.div 
              className="text-center mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <motion.button 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white/90 hover:from-purple-500/30 hover:to-blue-500/30 hover:border-gray-300/70 dark:hover:border-white/30 transition-all duration-200 backdrop-blur-sm group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-medium font-unbounded">Explore All Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};