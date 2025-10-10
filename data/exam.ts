import type { Exam } from '@/components/exam'

export const sampleExam: Exam = {
  id: "exam-001",
  title: "Exam on Designing for Memorisation",
  mode: 'Exercice',
  exercises: [
    {
      type: "fill-in",
      content: "The '____ effect' demonstrates that retrieval practice strengthens long-term retention more than passive review.",
      options: [
        "testing",
        "spacing",
        "interleaving"
      ],
      answer: "testing"
    },
    {
      type: "fill-in",
      content: "____ practice involves spreading practice and tests over time for better retention.",
      options: [
        "Massed",
        "Spaced",
        "Blocked"
      ],
      answer: "Spaced"
    },
    {
      type: "mcq",
      content: "Which of the following is NOT a principle for improving long-term retention?",
      options: [
        "Retrieval practice",
        "Spacing",
        "Massed practice",
        "Interleaving"
      ],
      answer: "Massed practice"
    },
    {
      type: "true/false",
      content: "Interleaving involves practicing one topic in dedicated blocks before moving to the next.",
      answer: "false"
    },
    {
      type: "fill-in",
      content: "Making tasks slightly harder, but still achievable, is known as creating '____ difficulties'.",
      options: [
        "desirable",
        "undesirable",
        "impossible"
      ],
      answer: "desirable"
    },
    {
      type: "mcq",
      content: "Which type of question is best for pure recall training?",
      options: [
        "Multiple choice",
        "True/False",
        "Fill-in-the-blank",
        "Essay"
      ],
      answer: "Fill-in-the-blank"
    },
    {
      type: "flashcard",
      content: "Define 'retrieval practice'.",
      answer: "Actively recalling information to strengthen long-term retention."
    },
    {
      type: "true/false",
      content: "Immediate feedback is always the most effective type of feedback for all learners.",
      answer: "false"
    },
    {
      type: "mcq",
      content: "What is the primary goal of using flashcards in learning?",
      options: [
        "Assessing complex problem-solving",
        "Rapid retrieval practice",
        "Encouraging passive review",
        "Measuring reading comprehension"
      ],
      answer: "Rapid retrieval practice"
    },
    {
      type: "fill-in",
      content: "Mixing related topics during practice is known as ____.",
      options: [
        "spacing",
        "interleaving",
        "blocking"
      ],
      answer: "interleaving"
    },
    {
      type: "mcq",
      content: "According to the text, what is a key characteristic of a good MCQ distractor?",
      options: [
        "It is obviously incorrect.",
        "It is based on common misconceptions.",
        "It is very similar to the correct answer, but uses complex wording.",
        "It is completely unrelated to the question."
      ],
      answer: "It is based on common misconceptions."
    },
    {
      type: "true/false",
      content: "Cognitive load management involves making exam questions as complex as possible to challenge students.",
      answer: "false"
    },
    {
      type: "flashcard",
      content: "Explain the concept of 'desirable difficulty'.",
      answer: "Making learning tasks slightly harder to improve encoding and retrieval, while still remaining achievable."
    },
    {
      type: "mcq",
      content: "Which assessment method is LEAST effective for promoting retrieval practice?",
      options: [
        "Short-answer questions",
        "Fill-in-the-blank questions",
        "Multiple-choice questions focused on application",
        "Passive review of notes"
      ],
      answer: "Passive review of notes"
    },
    {
      type: "fill-in",
      content: "The principle of ____ encourages learners to produce or explain answers to deepen encoding.",
      options: [
        "generation",
        "recognition",
        "rote memorization"
      ],
      answer: "generation"
    },
    {
      type: "true/false",
      content: "Spacing out study sessions is less effective than cramming all the information at once.",
      answer: "false"
    },
    {
      type: "flashcard",
      content: "What is the main goal of designing a spaced testing schedule?",
      answer: "To pair immediate practice with later cumulative retrieval opportunities."
    },
    {
      type: "mcq",
      content: "Which of the following is a recommendation for managing cognitive load in exam design?",
      options: [
        "Using overly long vignettes",
        "Focusing each item on multiple concepts",
        "Keeping stems concise",
        "Including extraneous data"
      ],
      answer: "Keeping stems concise"
    },
    {
      type: "fill-in",
      content: "HTTP status 200 means ____.",
      options: [
        "OK",
        "Error",
        "Not Found"
      ],
      answer: "OK"
    },
    {
      type: "true/false",
      content: "According to the text, it is better to avoid any kind of hints in the questions to make them more difficult.",
      answer: "false"
    },
    {
      type: "mcq",
      content: "Which of the following is the best way to provide feedback?",
      options: [
        "Delayed, general feedback",
        "Timely, specific feedback",
        "No feedback at all",
        "Only provide feedback if the answer is wrong"
      ],
      answer: "Timely, specific feedback"
    }
  ]
}


