import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, Clock, Users } from 'lucide-react';
import { ExamStats as ExamStatsType } from './types';

interface ExamStatsProps {
  stats: ExamStatsType;
}

export const ExamStats: React.FC<ExamStatsProps> = ({ stats }) => {
  const statItems = [
    { icon: FileText, label: 'Questions', value: stats.totalQuestions },
    { icon: Target, label: 'Total Points', value: stats.totalPoints },
    { icon: Clock, label: 'Time Limit', value: `${stats.timeLimit}m` },
    { icon: Users, label: 'Sections', value: stats.sectionsCount },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <h3 className="text-lg font-syne font-medium text-white mb-6">Exam Overview</h3>
      <div className="space-y-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <stat.icon className="w-4 h-4 text-white/60" />
              <span className="font-geist-mono text-sm text-white/70">{stat.label}</span>
            </div>
            <span className="font-geist-mono font-medium text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 