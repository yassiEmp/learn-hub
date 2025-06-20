import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ExamDetailsProps {
  title: string;
  description: string;
  timeLimit: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onTimeLimitChange: (timeLimit: number) => void;
}

export const ExamDetails: React.FC<ExamDetailsProps> = ({
  title,
  description,
  timeLimit,
  onTitleChange,
  onDescriptionChange,
  onTimeLimitChange
}) => {
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-white/10 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Brain className="w-5 h-5 text-blue-400" />
        </motion.div>
        <h2 className="text-xl font-syne font-medium text-white">Exam Details</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-geist-mono text-white/70 mb-2">Exam Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter exam title..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-geist-mono text-white/70 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe what this exam covers..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => onTimeLimitChange(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Difficulty Level</label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 