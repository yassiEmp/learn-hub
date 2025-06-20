import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ExamSection } from './ExamSection';
import { ExamSection as ExamSectionType, Question } from './types';

interface ExamQuestionSectionsProps {
  sections: ExamSectionType[];
  addSection: () => void;
  onAddQuestion: (sectionId: string) => void;
  onUpdateQuestion: (sectionId: string, questionId: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (sectionId: string, questionId: string) => void;
  onToggleSection: (sectionId: string) => void;
  onSectionTitleChange: (sectionId: string, title: string) => void;
}

export const ExamQuestionSections: React.FC<ExamQuestionSectionsProps> = ({
  sections,
  addSection,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onToggleSection,
  onSectionTitleChange,
}) => {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <ExamSection
          key={section.id}
          section={section}
          onToggle={() => onToggleSection(section.id)}
          onTitleChange={(title) => onSectionTitleChange(section.id, title)}
          onAddQuestion={() => onAddQuestion(section.id)}
          onUpdateQuestion={onUpdateQuestion}
          onDeleteQuestion={onDeleteQuestion}
        />
      ))}

      {/* Add New Section Button */}
      <motion.button
        onClick={addSection}
        className="w-full p-6 border-2 border-dashed border-white/20 rounded-2xl text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2 font-geist-mono"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5" />
        <span>Add New Section</span>
      </motion.button>
    </div>
  );
}; 