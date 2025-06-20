export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'flash-card' | 'fill-text';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  // Add specific fields for new types if needed, e.g.,
  // frontContent?: string;
  // backContent?: string;
  // fillInText?: string;
}

export interface ExamSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isExpanded: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface QuestionType {
  id: string;
  label: string;
  icon: React.ComponentType;
  description: string;
}

export interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

export interface ExamStats {
  totalQuestions: number;
  totalPoints: number;
  timeLimit: number;
  sectionsCount: number;
} 