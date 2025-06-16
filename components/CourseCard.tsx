import React from 'react';
import { Star, Clock, Users, Play, BookOpen, Code, Palette, Database, Smartphone, Settings } from 'lucide-react';
import { Course } from '../types/course';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: Course;
  onCourseSelect: (course: Course) => void;
  viewMode?: 'grid' | 'list';
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

export const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect, viewMode = 'grid' }) => {
  const CategoryIcon = getCategoryIcon(course.category);
  const categoryColor = getCategoryColor(course.category);

  if (viewMode === 'list') {
    return (
      <motion.div 
        className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:border-white/20 transition-all duration-500"
        onClick={() => onCourseSelect(course)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ 
          scale: 1.01,
          y: -2,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="p-6">
          <div className="flex items-start space-x-6">
            {/* Course Visual */}
            <div className="flex-shrink-0">
              <motion.div
                className={`w-24 h-24 bg-gradient-to-br ${categoryColor} rounded-xl relative overflow-hidden border border-white/10`}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ 
                  scale: 1, 
                  opacity: 1
                }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:8px_8px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CategoryIcon className="w-8 h-8 text-white/80" />
                </div>
              </motion.div>
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full font-geist-mono">
                      {course.category}
                    </span>
                    <span className="text-white/50 text-xs font-geist-mono">{course.level}</span>
                  </div>
                  <h3 className="text-xl font-syne font-medium text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-white/60 text-sm font-geist-mono line-clamp-2 mb-3">
                    {course.description}
                  </p>
                </div>
                
                {course.isEnrolled && (
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-geist-mono border border-green-500/20">
                    Enrolled
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/50 font-geist-mono">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.studentsCount.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {course.originalPrice && (
                    <span className="text-white/40 line-through text-sm font-geist-mono">
                      ${course.originalPrice}
                    </span>
                  )}
                  <span className="text-xl font-syne font-medium text-white">
                    ${course.price}
                  </span>
                </div>
              </div>

              {course.isEnrolled && course.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/50 mb-2 font-geist-mono">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <motion.div 
                      className="bg-green-400 h-1.5 rounded-full" 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${course.progress}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:border-white/20 transition-all duration-500"
      onClick={() => onCourseSelect(course)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden h-48">
        {/* Gradient background */}
        <motion.div
          className={`w-full h-full bg-gradient-to-br ${categoryColor} relative`}
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ 
            scale: 1, 
            opacity: 1
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.6, ease: "easeOut" }
          }}
        >
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:12px_12px]" />
          </div>
          
          {/* Category icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              whileInView={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <CategoryIcon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ 
              scale: 1, 
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
          >
            <Play className="h-6 w-6 text-white ml-0.5" />
          </motion.div>
        </motion.div>
        
        {course.originalPrice && (
          <motion.div 
            className="absolute top-4 left-4 bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs font-geist-mono border border-red-500/20"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ 
              scale: 1, 
              opacity: 1
            }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Sale
          </motion.div>
        )}
        {course.isEnrolled && (
          <motion.div 
            className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-geist-mono border border-green-500/20"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ 
              scale: 1, 
              opacity: 1
            }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Enrolled
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ 
          opacity: 1, 
          y: 0
        }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="mb-3">
          <motion.span 
            className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full font-geist-mono"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
          >
            {course.category}
          </motion.span>
          <span className="ml-2 text-white/50 text-xs font-geist-mono">{course.level}</span>
        </div>
        
        <h3 className="text-lg font-syne font-medium text-white mb-2 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
          {course.title}
        </h3>
        
        <p className="text-white/60 text-sm mb-4 line-clamp-2 font-geist-mono">
          {course.description}
        </p>
        
        <motion.div 
          className="flex items-center mb-4"
          whileHover={{ 
            x: 2,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-6 h-6 rounded-full mr-2 border border-white/20"
          />
          <span className="text-white/70 text-sm font-geist-mono">{course.instructor}</span>
        </motion.div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-xs text-white/50 font-geist-mono">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {course.studentsCount.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-geist-mono text-white/70">{course.rating}</span>
          </div>
        </div>
        
        {course.isEnrolled && course.progress !== undefined ? (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/50 mb-2 font-geist-mono">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <motion.div 
                className="bg-green-400 h-1.5 rounded-full" 
                initial={{ width: 0 }}
                whileInView={{ width: `${course.progress}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {course.originalPrice && (
                <span className="text-white/40 line-through text-sm font-geist-mono">
                  ${course.originalPrice}
                </span>
              )}
              <motion.span 
                className="text-xl font-syne font-medium text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                ${course.price}
              </motion.span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};