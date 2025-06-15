import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Lock, BookOpen, Code, Palette, Database, Smartphone, Settings, Award, Globe } from 'lucide-react';
import { Course } from '../types/course';
import { motion , Variants } from 'framer-motion';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onStartLearning: (course: Course) => void;
}

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return Code;
    case 'data science':
      return Database;
    case 'design':
      return Palette;
    case 'mobile development':
      return Smartphone;
    case 'devops':
      return Settings;
    default:
      return BookOpen;
  }
};

// Category color mapping
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return 'from-blue-400/20 to-cyan-400/20';
    case 'data science':
      return 'from-green-400/20 to-emerald-400/20';
    case 'design':
      return 'from-purple-400/20 to-pink-400/20';
    case 'mobile development':
      return 'from-orange-400/20 to-red-400/20';
    case 'devops':
      return 'from-gray-400/20 to-slate-400/20';
    default:
      return 'from-indigo-400/20 to-blue-400/20';
  }
};

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onStartLearning }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const CategoryIcon = getCategoryIcon(course.category);
  const categoryColor = getCategoryColor(course.category);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
  ];

  const containerVariants : Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants : Variants = {
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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center text-white/60 hover:text-white mb-8 group transition-all duration-300"
          variants={itemVariants}
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-geist-mono text-sm">Back to courses</span>
        </motion.button>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Course Info */}
          <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
            {/* Course Header */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <motion.span 
                  className="inline-block bg-white/10 text-white/90 text-sm px-3 py-1.5 rounded-full font-geist-mono border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {course.category}
                </motion.span>
                <span className="text-white/50 font-geist-mono text-sm">{course.level}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-syne font-medium text-white leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-white/80 font-geist-mono leading-relaxed">
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/60 font-geist-mono">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-white">{course.rating}</span>
                  <span>({course.studentsCount.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.lessonsCount} lessons</span>
                </div>
              </div>
              
              {/* Instructor */}
              <motion.div 
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                <div>
                  <p className="font-medium text-white font-geist-mono">{course.instructor}</p>
                  <p className="text-white/60 text-sm font-geist-mono">Course Instructor</p>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              <div className="flex space-x-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-lg font-geist-mono text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div 
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8"
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-syne font-medium text-white mb-6">What you'll learn</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {course.tags.map((tag, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-white/80 font-geist-mono">Master {tag} fundamentals and advanced concepts</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-syne font-medium text-white mb-4">Course Requirements</h2>
                      <ul className="space-y-3 text-white/70 font-geist-mono">
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-white/40" />
                          <span>Basic understanding of programming concepts</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-white/40" />
                          <span>Computer with internet connection</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-white/40" />
                          <span>Willingness to learn and practice</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-syne font-medium text-white mb-4">Description</h2>
                      <p className="text-white/70 leading-relaxed font-geist-mono">
                        {course.description} This comprehensive course is designed to take you from beginner to advanced level,
                        with hands-on projects and real-world examples. You'll learn industry best practices and build a
                        portfolio of projects that will help you stand out in the job market.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-syne font-medium text-white mb-6">Course Curriculum</h2>
                    <div className="space-y-3">
                      {course.lessons.map((lesson, index) => (
                        <motion.div 
                          key={lesson.id} 
                          className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {lesson.isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                              ) : lesson.isCurrent ? (
                                <Play className="w-6 h-6 text-blue-400" />
                              ) : (
                                <Lock className="w-6 h-6 text-white/40" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-white font-geist-mono">
                                {index + 1}. {lesson.title}
                              </h3>
                              <p className="text-sm text-white/50 font-geist-mono">{lesson.duration}</p>
                            </div>
                          </div>
                          {(course.isEnrolled || index === 0) && (
                            <button className="text-blue-400 hover:text-blue-300 font-medium text-sm font-geist-mono opacity-0 group-hover:opacity-100 transition-opacity">
                              {lesson.isCompleted ? 'Review' : 'Watch'}
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-24 h-24 rounded-full border-2 border-white/20"
                      />
                      <div className="flex-1">
                        <h2 className="text-2xl font-syne font-medium text-white mb-2">{course.instructor}</h2>
                        <p className="text-blue-400 font-medium mb-4 font-geist-mono">Senior Developer & Instructor</p>
                        <div className="flex items-center space-x-6 text-sm text-white/50 mb-6 font-geist-mono">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>4.8 Instructor Rating</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>25,000+ Students</span>
                          </div>
                        </div>
                        <p className="text-white/70 leading-relaxed font-geist-mono">
                          With over 10 years of experience in software development and 5 years in teaching,
                          {course.instructor} has helped thousands of students transition into successful tech careers.
                          Specializing in modern web development and data science, they bring real-world experience
                          and practical insights to every lesson.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Column - Course Card */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="sticky top-8">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 space-y-6">
                {/* Course Visual */}
                <motion.div
                  className={`w-full h-48 bg-gradient-to-br ${categoryColor} rounded-xl relative overflow-hidden border border-white/10`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                  </div>
                  
                  {/* Category icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <CategoryIcon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Play overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </motion.div>
                </motion.div>
                
                {course.isEnrolled ? (
                  <div className="space-y-6">
                    {course.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm text-white/60 mb-3 font-geist-mono">
                          <span>Your Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-green-400 h-3 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                    <motion.button
                      onClick={() => onStartLearning(course)}
                      className="w-full bg-white text-black py-4 px-6 rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-2 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Continue Learning</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      {course.originalPrice && (
                        <span className="text-white/50 line-through text-lg block font-geist-mono">
                          ${course.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-syne font-medium text-white">
                        ${course.price}
                      </span>
                    </div>
                    <motion.button 
                      className="w-full bg-white text-black py-4 px-6 rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Enroll Now
                    </motion.button>
                    <p className="text-center text-sm text-white/50 font-geist-mono">
                      30-day money-back guarantee
                    </p>
                  </div>
                )}

                {/* Course Features */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <h3 className="font-medium text-white font-geist-mono">This course includes:</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Clock, text: `${course.duration} on-demand video` },
                      { icon: BookOpen, text: `${course.lessonsCount} lessons` },
                      { icon: Award, text: 'Certificate of completion' },
                      { icon: Globe, text: 'Lifetime access' }
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center space-x-3 text-white/70 font-geist-mono text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <feature.icon className="w-4 h-4 text-white/50" />
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};