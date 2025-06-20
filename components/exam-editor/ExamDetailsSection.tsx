import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Eye } from 'lucide-react';

interface ExamDetailsSectionProps {
  examTitle: string;
  setExamTitle: (title: string) => void;
  examDescription: string;
  setExamDescription: (description: string) => void;
}

export const ExamDetailsSection: React.FC<ExamDetailsSectionProps> = ({
  examTitle,
  setExamTitle,
  examDescription,
  setExamDescription,
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <input
        type="text"
        value={examTitle}
        onChange={(e) => setExamTitle(e.target.value)}
        className="text-3xl font-syne font-medium text-white bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1 transition-all duration-200 mb-2"
        placeholder="Exam Title (e.g., SA1: les pairs)"
      />
      <textarea
        value={examDescription}
        onChange={(e) => setExamDescription(e.target.value)}
        className="w-full bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1 transition-all duration-200 text-white/60 font-geist-mono text-base resize-none"
        placeholder="Description (e.g., this is the collection of all the courses...)"
        rows={3}
      />
      <div className="flex space-x-4 mt-4">
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-geist-mono text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit With AI</span>
        </motion.button>
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-geist-mono text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="w-4 h-4" />
          <span>Try This</span>
        </motion.button>
      </div>
    </div>
  );
}; 