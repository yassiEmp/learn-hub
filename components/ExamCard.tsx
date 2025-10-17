import React from 'react';
import { Clock, BookOpen, Play, Calendar, BarChart3, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExamData } from '@/features/exam/hooks/useExams';

interface ExamCardProps {
  exam: ExamData;
  onExamSelect: (exam: ExamData) => void;
  viewMode?: 'grid' | 'list';
}

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return BookOpen;
    case 'data science':
      return BarChart3;
    case 'design':
      return FileText;
    case 'mobile development':
      return BookOpen;
    case 'devops':
      return BookOpen;
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

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onExamSelect, viewMode = 'grid' }) => {
  const category = exam.course?.category || 'General';
  const CategoryIcon = getCategoryIcon(category);
  const categoryColor = getCategoryColor(category);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div 
        className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:border-white/20 transition-all duration-500"
        onClick={() => onExamSelect(exam)}
        whileHover={{ 
          scale: 1.01,
          y: -2,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.99 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="p-6">
          <div className="flex items-start space-x-6">
            {/* Exam Visual */}
            <div className="flex-shrink-0">
              <motion.div
                className={`w-24 h-24 bg-gradient-to-br ${categoryColor} rounded-xl relative overflow-hidden border border-white/10`}
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

            {/* Exam Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full font-geist-mono">
                      {category}
                    </span>
                    <span className="text-white/50 text-xs font-geist-mono">{exam.course?.level || 'General'}</span>
                  </div>
                  <h3 className="text-xl font-syne font-medium text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                    {exam.title}
                  </h3>
                  {exam.course && (
                    <p className="text-white/60 text-sm font-geist-mono line-clamp-2 mb-3">
                      From: {exam.course.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/50 font-geist-mono">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {exam.totalQuestions} questions
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(exam.estimatedDuration)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(exam.created_at)}
                  </div>
                </div>
                
                <motion.button
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-geist-mono transition-all duration-300 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Exam
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:border-white/20 transition-all duration-500"
      onClick={() => onExamSelect(exam)}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3, ease: "linear" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "linear" }}
    >
      <div className="relative overflow-hidden h-48">
        {/* Gradient background */}
        <motion.div
          className={`w-full h-full bg-gradient-to-br ${categoryColor} relative`}
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
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
      </div>
      
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="mb-3">
          <motion.span 
            className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full font-geist-mono"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
          >
            {category}
          </motion.span>
          <span className="ml-2 text-white/50 text-xs font-geist-mono">{exam.course?.level || 'General'}</span>
        </div>
        
        <h3 className="text-lg font-syne font-medium text-white mb-2 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
          {exam.title}
        </h3>
        
        {exam.course && (
          <p className="text-white/60 text-sm mb-4 line-clamp-2 font-geist-mono">
            From: {exam.course.title}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-xs text-white/50 font-geist-mono">
            <div className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              {exam.totalQuestions} questions
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(exam.estimatedDuration)}
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-white/50 mr-1" />
            <span className="text-sm font-geist-mono text-white/70">{formatDate(exam.created_at)}</span>
          </div>
        </div>
        
        <motion.button
          className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-geist-mono transition-all duration-300 border border-white/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Exam
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
