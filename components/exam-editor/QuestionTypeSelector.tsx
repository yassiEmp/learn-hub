import React from 'react';
import { motion } from 'framer-motion';
import { Circle, ToggleLeft, Edit3, FileText } from 'lucide-react';
import { QuestionType } from './types';
import { cn } from '../../lib/utils';

const questionTypes: QuestionType[] = [
  { id: 'multiple-choice', label: 'Multiple Choice', icon: Circle, description: 'Select one correct answer' },
  { id: 'true-false', label: 'True/False', icon: ToggleLeft, description: 'Yes or No questions' },
  { id: 'short-answer', label: 'Short Answer', icon: Edit3, description: 'Brief text response' },
  { id: 'essay', label: 'Essay', icon: FileText, description: 'Long form response' },
];

interface QuestionTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onTypeSelect
}) => {
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-lg font-syne font-medium text-white mb-6">Question Types</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {questionTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={cn(
              "p-4 rounded-xl border transition-all duration-300 text-left",
              selectedType === type.id
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <type.icon className="w-5 h-5 mb-2" />
            <h4 className="font-geist-mono font-medium text-sm mb-1">{type.label}</h4>
            <p className="text-xs text-white/50">{type.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}; 