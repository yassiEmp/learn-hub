import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, FileText } from 'lucide-react';
import { ExamSection as ExamSectionType, Question } from './types';
import { QuestionEditor } from './QuestionEditor';

interface ExamSectionProps {
  section: ExamSectionType;
  onToggle: () => void;
  onTitleChange: (title: string) => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export const ExamSection: React.FC<ExamSectionProps> = ({
  section,
  onToggle,
  onTitleChange,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion
}) => {
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {section.isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <div>
              <input
                type="text"
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="text-lg font-syne font-medium text-white bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1 transition-all duration-200"
              />
              <p className="text-white/50 font-geist-mono text-sm">
                {section.questions.length} questions
              </p>
            </div>
          </div>
          <motion.button
            onClick={onAddQuestion}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-geist-mono text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </motion.button>
        </div>
      </div>

      {/* Section Content */}
      <AnimatePresence>
        {section.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 space-y-6">
              {section.questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/50 font-geist-mono">No questions yet. Add your first question to get started.</p>
                </div>
              ) : (
                section.questions.map((question, questionIndex) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    questionIndex={questionIndex}
                    onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                    onDelete={() => onDeleteQuestion(question.id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 