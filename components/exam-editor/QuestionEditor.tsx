import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit, Trash2, Circle, ToggleLeft, Edit3, FileText, X, Copy, Zap, Plus } from 'lucide-react';
import { Question, QuestionEditorProps } from './types';
import { cn } from '../../lib/utils';
import { FlashCardEditor } from './FlashCardEditor';
import { FillTextEditor } from './FillTextEditor';

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  questionIndex,
  onUpdate,
  onDelete
}) => {
  const questionTypes = [
    { id: 'multiple-choice', label: 'Multiple Choice', icon: Circle },
    { id: 'true-false', label: 'Yes / NO', icon: ToggleLeft },
    { id: 'flash-card', label: 'Flash card', icon: Copy },
    { id: 'fill-text', label: 'Fill text', icon: Zap },
    { id: 'short-answer', label: 'Short Answer', icon: Edit3 },
    { id: 'essay', label: 'Essay', icon: FileText },
  ];

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Question</label>
            <textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Enter your question..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
            />

            <label className="block text-sm font-geist-mono text-white/70 mb-2">Response</label>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="font-geist-mono text-sm text-white/60 w-5 text-center">{index + 1}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/40 font-geist-mono text-sm"
                  />
                  <button 
                    onClick={() => onUpdate({ options: question.options?.filter((_, i) => i !== index) })}
                    className="p-1 rounded-full text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <motion.button
                onClick={() => onUpdate({ options: [...(question.options || []), ''] })}
                className="w-full p-3 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2 font-geist-mono text-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="w-4 h-4" />
                <span>type here to add new option</span>
              </motion.button>
            </div>
          </div>
        );
      case 'true-false':
        return (
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Question</label>
            <textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Enter your question..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
            />

            <label className="block text-sm font-geist-mono text-white/70 mb-2">Response</label>
            <div className="flex space-x-4">
              <motion.button
                onClick={() => onUpdate({ correctAnswer: 'yes' })}
                className={cn(
                  "px-5 py-3 rounded-xl border font-geist-mono font-medium text-sm",
                  question.correctAnswer === 'yes' ? "bg-blue-500 text-white border-blue-500" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                YES
              </motion.button>
              <motion.button
                onClick={() => onUpdate({ correctAnswer: 'no' })}
                className={cn(
                  "px-5 py-3 rounded-xl border font-geist-mono font-medium text-sm",
                  question.correctAnswer === 'no' ? "bg-blue-500 text-white border-blue-500" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                NO
              </motion.button>
            </div>
          </div>
        );
      case 'flash-card':
        return <FlashCardEditor question={question} questionIndex={questionIndex} onUpdate={onUpdate} onDelete={onDelete} />;
      case 'fill-text':
        return <FillTextEditor question={question} questionIndex={questionIndex} onUpdate={onUpdate} onDelete={onDelete} />;
      case 'short-answer':
      case 'essay':
        return (
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Question</label>
            <textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Enter your question..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
            />
            <label className="block text-sm font-geist-mono text-white/70 mb-2">
              {question.type === 'essay' ? 'Expected Answer/Rubric' : 'Correct Answer'}
            </label>
            <textarea
              value={question.correctAnswer as string || ''}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              placeholder={question.type === 'essay' ? 'Describe the expected answer or grading rubric...' : 'Enter the correct answer...'}
              rows={question.type === 'essay' ? 4 : 2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
            />
          </div>
        );
      default:
        return <p className="text-white/50">Select a question type to start editing.</p>;
    }
  };

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question Card Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <span className="font-syne font-medium text-white">Question {questionIndex + 1}</span>
          <div className="flex space-x-1">
            <button className="p-1 rounded-md text-white/60 hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded-md text-white/60 hover:bg-white/10"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <select
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value as Question['type'], options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined, correctAnswer: undefined, question: '' })}
            className="bg-white/10 border border-white/20 rounded-md text-white font-geist-mono text-sm px-2 py-1"
          >
            {questionTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded-md text-white/60 hover:bg-white/10"><Edit className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-1 rounded-md text-red-400/60 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Render content based on question type */}
      {renderQuestionContent()}
    </motion.div>
  );
}; 