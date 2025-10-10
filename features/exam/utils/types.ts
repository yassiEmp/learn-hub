// ===============================================
// 📘 Learning Science–Aligned Exam Type System
// ===============================================

//================================
// 🧠 clean types for ai generation 
//=================================
// This replaces the 'exercises' property of Exam with 'exercises' of type CleanExercise[].
export type CleanExam = Omit<Exam, 'mode' | 'exercises'> & { exercises: CleanExercise[] }; // A "clean" Exercise type with metadata removed
export type CleanExercise = Omit<Exercise, 'meta'>;
export type CreateExam = (content:string)=>Promise<CleanExam>
export type CleanExerciseFeedback = 
| Omit<MCQFeedback,'shownAt' | 'wasHelpful'>
| Omit<FillInFeedback,'shownAt' | 'wasHelpful'>
| Omit<TrueOrFalseFeedback,'shownAt' | 'wasHelpful'>
| Omit<FlashcardFeedback,'shownAt' | 'wasHelpful'>;
export type CleanExerciseFeedbackMap = Map<number,CleanExerciseFeedback>
// -----------------------------
// 🧠 Core Exam and Exercise Types
// -----------------------------
export type Exam = {
  id: string;
  title: string;
  exercises: Exercise[];
  mode: 'flashCard' | 'Exercice';
};

// -----------------------------
// 🧩 Exercise Types (Discriminated Union)
// -----------------------------
export type Exercise =
  | {
    type: 'fill-in';
    content: string;
    options: string[];
    answer: string;
    meta?: CognitiveMetadata;
  }
  | {
    type: 'true/false';
    content: string;
    answer: 'true' | 'false';
    meta?: CognitiveMetadata;
  }
  | {
    type: 'mcq';
    content: string;
    options: string[];
    answer: string;
    meta?: CognitiveMetadata;
  }
  | {
    type: 'flashcard';
    content: string;
    answer: string;
    meta?: CognitiveMetadata;
  };

// -----------------------------
// 🧩 Cognitive Metadata (Learning-Science Layer)
// -----------------------------
export type CognitiveMetadata = {
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];             // For topic grouping / interleaving
  attempts?: number;           // Number of times answered
  successRate?: number;        // % of correct attempts
  lastReviewed?: string;       // ISO timestamp
  nextReview?: string;         // For spaced repetition scheduling
  memoryStrength?: MemoryStrength; // Embedded memory model
};

// -----------------------------
// 🧠 Memory Strength (Spaced Repetition Fields)
// -----------------------------
export type MemoryStrength = {
  easeFactor: number;   // How easily the learner recalls (SM-2 style)
  interval: number;     // Days until next review
  lastInterval?: number; // Optional: previous interval (tracking change)
};

// -----------------------------
// 📊 Exam Analytics
// -----------------------------
export type ExamAnalytics = {
  accuracy: number;
  correctAnswer: number;
  incorrectAnswer: number;
  resultForExercise: Map<number, string>; // exercise index → user answer
  resultTrue: Map<number, boolean>;       // exercise index → correctness
  feedbackMap?: Map<number, Feedback>;     // exercise index → feedback object
  averageDifficulty?: number;
  timeSpent?: number; // total time (s)
  spacedReviewStats?: {
    reviewedToday: number;
    nextDueCount: number;
    overdueCount: number;
  };
};

// -----------------------------
// 💬 Feedback Model
// -----------------------------
export type Feedback = {
  message: string;
  explanation?: string;
  shownAt: string; // ISO timestamp
  wasHelpful?: boolean;
};

// Base feedback type
export type BaseFeedback = {
  shownAt: string; // ISO timestamp
  wasHelpful?: boolean;
};

// MCQ Feedback: map option index → explanation
export type MCQFeedback = BaseFeedback & {
  type: 'mcq';
  explanations: Map<number, string>; // each option index -> explanation
};

// Fill-in Feedback: map option index → explanation
export type FillInFeedback = BaseFeedback & {
  type: 'fill-in';
  explanations: Map<number, string>; // each option index -> explanation
};

// True/False Feedback
export type TrueOrFalseFeedback = BaseFeedback & {
  type: 'true/false';
  explanation?: string; // short explanation why true or false
};

// Flashcard Feedback
export type FlashcardFeedback = BaseFeedback & {
  type: 'flashcard';
  explanation?: string; // elaboration / mnemonic
};
export type ExerciseFeedback =
  | MCQFeedback
  | FillInFeedback
  | TrueOrFalseFeedback
  | FlashcardFeedback;
export type ExerciseFeedbackMap = Map<number,ExerciseFeedback>
// -----------------------------
// 🧭 Learning Session Types
// -----------------------------
export type LearningMode = 'study' | 'review' | 'test';

export type LearningSession = {
  id: string;
  mode: LearningMode;
  exercises: Exercise[];
  startedAt: string;
  completedAt?: string;
  analytics?: ExamAnalytics;
};

// -----------------------------
// 🎛️ UI Layer Types (Component Props)
// -----------------------------
export type ButtonVariant = 'true' | 'false' | 'selected' | 'nonSelected';

// Multiple-Choice Question Component
export interface MCQProps {
  content: string;
  options: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
  onAnswerSelect?: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

// True/False Question Component
export interface TrueOrFalseProps {
  content: string;
  selectedAnswer?: string;
  correctAnswer?: string;
  onAnswerSelect?: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

// Flashcard / Flipcard Component
export interface FlipCardProps {
  handleValidationClick: (answer: string, isCorrect: boolean) => void;
  question: string;
  answer: string;
  showResult?: boolean;
  isCorrect?: boolean;
}

// Fill-in-the-Blank Component
export interface FillInGapProps {
  content: string;
  options: string[];
  correctAnswers?: string[]; // Optional: for each blank
  onChange?: (answers: string[]) => void;
  onCheck?: (answers: string[], isCorrect?: boolean) => void;
}

// ===============================================
// ✅ End of Learning Science–Aligned Type System
// ===============================================
