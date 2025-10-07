import React from 'react'
import { Exam , ExamAnalytics } from './types'
import { RotateCcw, BookOpen, Eye, CheckCircle, XCircle, Target, TrendingUp } from 'lucide-react'

interface ExamAnalyticsProps {
  exam: Exam ,
  analytics: ExamAnalytics ,
  onRetry: () => void ,
  onViewLesson: () => void ,
  onViewSummary: () => void ,
  onQuestionClick: (questionIndex: number) => void ,
}

const CircularProgress = ({ percentage, size = 140 }: { percentage: number; size?: number }) => {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 drop-shadow-lg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          className="text-gray-800/50"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${getColor(percentage)} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white drop-shadow-sm">{percentage}%</span>
        <span className="text-xs text-gray-400 font-medium">Accuracy</span>
      </div>
    </div>
  )
}

const QuestionCard = ({
  questionIndex,
  question,
  isCorrect,
  questionType,
  userAnswer,
  correctAnswer
}: {
  questionIndex: number
  question: string
  isCorrect: boolean
  questionType: string
  userAnswer?: string
  correctAnswer?: string
}) => {
  return (
    <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-sm font-semibold text-gray-300">
            {questionIndex + 1}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{questionType}</span>
            <div className={`w-2 h-2 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isCorrect
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
          {isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-6">
        <p className="text-white text-sm leading-relaxed font-medium">{question}</p>
      </div>

      {/* Answer Section */}
      <div className="space-y-3">
        {/* User Answer */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Answer</span>
          </div>
          <div className={`px-4 py-3 rounded-lg border-l-4 ${isCorrect
              ? 'bg-emerald-500/5 border-emerald-500 text-emerald-300'
              : 'bg-red-500/5 border-red-500 text-red-300'
            }`}>
            <span className="text-sm font-medium">
              {userAnswer || 'No answer provided'}
            </span>
          </div>
        </div>

        {/* Correct Answer (only show if incorrect) */}
        {!isCorrect && correctAnswer && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Correct Answer</span>
            </div>
            <div className="px-4 py-3 rounded-lg border-l-4 bg-emerald-500/5 border-emerald-500 text-emerald-300">
              <span className="text-sm font-medium">{correctAnswer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const QuestionGrid = ({
  questions,
  results,
  onQuestionClick
}: {
  questions: { type: string; content: string; answer: string; options: string[] }[]
  results: Map<number, boolean>
  onQuestionClick: (index: number) => void
}) => {
  const correctCount = Array.from(results.values()).filter(Boolean).length
  const incorrectCount = results.size - correctCount

  return (
    <div className="space-y-6">
      {/* Question Navigation Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-11 gap-3">
        {questions.map((_, index) => {
          const isCorrect = results.get(index) ?? false
          return (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`group relative w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 hover:shadow-lg ${isCorrect
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/25'
                  : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-red-500/25'
                }`}
            >
              <span className="relative z-10">{index + 1}</span>
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity ${isCorrect ? 'bg-white' : 'bg-white'
                }`}></div>
            </button>
          )
        })}
      </div>

      {/* Statistics Summary */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
          <span className="text-gray-300">Correct</span>
          <span className="text-emerald-400 font-bold text-lg">{correctCount}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
          <span className="text-gray-300">Incorrect</span>
          <span className="text-red-400 font-bold text-lg">{incorrectCount}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
          <span className="text-gray-300">Total</span>
          <span className="text-blue-400 font-bold text-lg">{questions.length}</span>
        </div>
      </div>
    </div>
  )
}

export const ExamAnalyticsComp = ({
  exam,
  analytics,
  onRetry,
  onViewLesson,
  onViewSummary,
  onQuestionClick
}: ExamAnalyticsProps) => {
  const results = analytics.resultTrue
  const userAnswers = analytics.resultForExercise
  const totalQuestions = exam.exercices.length
  const correctAnswers = Array.from(results.values()).filter(Boolean).length
  const incorrectAnswers = results.size - correctAnswers
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
              {/* Title and Actions */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {exam.name}
                  </h1>
                  <p className="text-gray-400 mt-2">Exam completed successfully</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onRetry}
                    className="group flex items-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="font-medium">Retry Exam</span>
                  </button>

                  <button
                    onClick={onViewLesson}
                    className="group flex items-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">View Lesson</span>
                  </button>

                  <button
                    onClick={onViewSummary}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Learning Summary</span>
                  </button>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="flex flex-col lg:items-end space-y-6">
                <CircularProgress percentage={accuracy} />

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-3">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{correctAnswers}</p>
                    <p className="text-gray-400 text-sm">Correct</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl border border-red-500/20 mb-3">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-red-400">{incorrectAnswers}</p>
                    <p className="text-gray-400 text-sm">Incorrect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Overview Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Question Overview</h2>
          </div>
          <QuestionGrid
            questions={exam.exercices}
            results={results}
            onQuestionClick={onQuestionClick}
          />
        </div>

        {/* Question Details Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Detailed Review</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-96 overflow-y-auto custom-scrollbar">
            {exam.exercices.map((question, index) => (
              <QuestionCard
                key={index}
                questionIndex={index}
                question={question.content}
                isCorrect={results.get(index) ?? false}
                questionType={question.type}
                userAnswer={userAnswers.get(index)}
                correctAnswer={question.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamAnalyticsComp
