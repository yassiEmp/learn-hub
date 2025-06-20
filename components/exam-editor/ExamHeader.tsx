import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Save } from 'lucide-react';

interface ExamHeaderProps {
  onBack: () => void;
  onPreview: () => void;
  onSave: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  onBack,
  onPreview,
  onSave
}) => {
  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            className="flex items-center text-white/60 hover:text-white group transition-all duration-300"
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-geist-mono text-sm">Back to exams</span>
          </motion.button>
          
          <div className="h-6 w-px bg-white/20" />
          
          <span className="px-3 py-1 text-xs font-geist-mono text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            Exam Builder
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onPreview}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-geist-mono text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </motion.button>
          <motion.button
            onClick={onSave}
            className="flex items-center space-x-2 px-6 py-2 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            <span>Save Exam</span>
          </motion.button>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-syne font-medium text-white mb-4 tracking-tight">
        Create New Exam
      </h1>
      <p className="text-lg text-white/60 font-geist-mono">
        Build comprehensive assessments with AI-powered question generation and smart analytics.
      </p>
    </motion.div>
  );
}; 