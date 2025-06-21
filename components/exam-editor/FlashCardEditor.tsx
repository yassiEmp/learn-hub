import React from 'react';
import { motion } from 'framer-motion';
import { QuestionEditorProps } from './types';
import { cn } from '../../lib/utils';

export const FlashCardEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Front Card */}
      <motion.div
        className="bg-white/5 border border-white/10 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <label className="block text-sm font-geist-mono text-white/70 mb-2">Front</label>
        <textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter the front content of the flashcard..."
          rows={4}
          className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
        />
      </motion.div>

      {/* Back Card */}
      <motion.div
        className="bg-white/5 border border-white/10 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <label className="block text-sm font-geist-mono text-white/70 mb-2">Back</label>
        <textarea
          value={question.correctAnswer as string || ''}
          onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
          placeholder="Enter the back content of the flashcard..."
          rows={4}
          className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
        />
      </motion.div>
    </div>
  );
}; 