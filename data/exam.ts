import type { Exam } from '@/components/exam'

export const sampleExam: Exam = {
  id: 'intro-js-001',
  name: 'Introduction to JavaScript - Fundamentals Check',
  exercices: [
    {
      type: 'mcq',
      content: 'Which of the following declares a constant in JavaScript?',
      options: ['var', 'let', 'const', 'static'],
      answer: 'const'
    },
    {
      type: 'yes/no',
      content: 'Arrow functions inherit their own this context.',
      options: ['yes', 'no'],
      answer: 'no'
    },
    {
      type: 'fill-in',
      content: 'Complete: Array.prototype.____ returns a new array with elements that pass the test.',
      options: ['filter', 'map', 'reduce', 'forEach'],
      answer: 'filter'
    },
    {
      type: 'flashcard',
      content: 'What does JSON stand for?',
      options: [],
      answer: 'JavaScript Object Notation'
    },
    {
      type: 'mcq',
      content: 'Which is NOT a primitive type in JavaScript?',
      options: ['string', 'number', 'boolean', 'array'],
      answer: 'array'
    }
  ],
  mode: 'Exercice'
}


