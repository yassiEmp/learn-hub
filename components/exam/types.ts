// Shared types for exam components

export type Exam = {
  id: string,
  name: string,
  exercices: Exercise[],
  mode: 'flashCard' | 'Exercice'
}

export type Exercise =
  | {
    type: 'fill-in';
    content: string;
    options: string[];
    answer: string;
  }
  | {
    type: 'yes/no';
    content: string;
    options: ['yes', 'no'];
    answer: 'yes' | 'no';
  }
  | {
    type: 'mcq';
    content: string;
    options: string[];
    answer: string;
  }
  | {
    type: 'flashcard';
    content: string;
    options: [];
    answer: string;
  };


export type ExamAnalytics = {
  accuracy: number,
  correctAnswer: number,
  incorrectAnswer: number,
  resultForExercice: Map<number, string>, // map the exercise index to the given answer by the user
  resultTrue: Map<number, boolean>, // say if the result is correct or not for each index in the exercice array
}

export type ButtonVariant = "true" | "false" | "selected" | "nonSelected"

// Component-specific prop types
export interface MCQProps {
  content: string,
  options: string[],
  selectedAnswer?: string,
  correctAnswer?: string,
  onAnswerSelect?: (answer: string) => void,
  showResult?: boolean,
  isCorrect?: boolean
}

export interface TrueOrFalseProps {
  content: string,
  options: string[],
  selectedAnswer?: string,
  correctAnswer?: string,
  onAnswerSelect?: (answer: string) => void,
  showResult?: boolean,
  isCorrect?: boolean
}

export interface FlipCardProps {
  handleValidationClick: (answer: string, isCorrect: boolean) => void,
  question: string,
  answer: string,
  showResult?: boolean,
  isCorrect?: boolean
}

export interface FillInGapProps {
  content: string,
  options: string[],
  // Optional list of correct answers for each blank (in order)
  correctAnswers?: string[],
  // Optional callbacks
  onChange?: (answers: string[]) => void,
  onCheck?: (answers: string[], isCorrect?: boolean) => void
}
