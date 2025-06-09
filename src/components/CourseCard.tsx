import React from 'react';
import { Star, Clock, Users, Play, BookOpen, Code, Palette, Database, Smartphone, Settings } from 'lucide-react';
import { Course } from '../types/course';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: Course;
  onCourseSelect: (course: Course) => void;
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
      return 'from-blue-500 to-cyan-500';
    case 'data science':
      return 'from-green-500 to-emerald-500';
    case 'design':
      return 'from-purple-500 to-pink-500';
    case 'mobile development':
      return 'from-orange-500 to-red-500';
    case 'devops':
      return 'from-gray-500 to-slate-500';
    default:
      return 'from-indigo-500 to-blue-500';
  }
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect }) => {
  const CategoryIcon = getCategoryIcon(course.category);
  const categoryColor = getCategoryColor(course.category);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={() => onCourseSelect(course)}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden h-48">
        {/* Gradient background instead of image */}
        <motion.div
          className={`w-full h-full bg-gradient-to-br ${categoryColor} relative`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
          </div>
          
          {/* Category icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CategoryIcon className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Play className="h-12 w-12 text-white" />
          </motion.div>
        </motion.div>
        
        {course.originalPrice && (
          <motion.div 
            className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Sale
          </motion.div>
        )}
        {course.isEnrolled && (
          <motion.div 
            className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Enrolled
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-2">
          <motion.span 
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            {course.category}
          </motion.span>
          <span className="ml-2 text-gray-500 text-sm">{course.level}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <motion.div 
          className="flex items-center mb-4"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span className="text-gray-700 text-sm font-medium">{course.instructor}</span>
        </motion.div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {course.studentsCount.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        
        {course.isEnrolled && course.progress !== undefined ? (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-green-500 h-2 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {course.originalPrice && (
                <span className="text-gray-500 line-through text-sm">
                  ${course.originalPrice}
                </span>
              )}
              <motion.span 
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
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