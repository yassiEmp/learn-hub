import React, { useState, useCallback } from 'react'
import ProgressBar from '../ProgressBar'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Exam } from './types'
import MCQ from './MCQ'
import TrueOrFalse from './TrueOrFalse'
import { FlipCard } from './FlipCard'
import { FillInGap } from './FillInGap'
import { ExamAnalyticsComp } from './ExamAnalytics'

const ExamComponant = ({ Exam }: { Exam: Exam }) => {
  const [currentExerciceIdx, setCurrentExerciceIdx] = useState<number>(0)
  const [currentFlashCardIdx, setCurrentFlashCardIdx] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string>>(new Map())
  const [answerResults, setAnswerResults] = useState<Map<number, boolean>>(new Map())
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map())
  const [isExamComplete, setIsExamComplete] = useState<boolean>(false)
  const [showResults, setShowResults] = useState<boolean>(false)

  const currentExercice = Exam.exercices[currentExerciceIdx]
  const isFlashcardMode = Exam.mode === 'flashCard'


  // Handle answer submission
  const handleAnswerSubmit = useCallback((answer: string, isCorrect?: boolean) => {
    const exerciseIndex = isFlashcardMode ? currentFlashCardIdx : currentExerciceIdx
    setSelectedAnswers(prev => new Map(prev.set(exerciseIndex, answer)))
    setUserAnswers(prev => new Map(prev.set(exerciseIndex, answer)))

    if (typeof isCorrect === 'boolean') {
      setAnswerResults(prev => new Map(prev.set(exerciseIndex, isCorrect)))
    } else {
      // For non-flashcard modes, check if answer is correct
      // We'll get the correct answer from the current exercise
      const currentExercise = Exam.exercices[exerciseIndex]
      const correctAnswer = currentExercise?.answer
      const isAnswerCorrect = answer === correctAnswer
      setAnswerResults(prev => new Map(prev.set(exerciseIndex, isAnswerCorrect)))
    }
  }, [currentExerciceIdx, currentFlashCardIdx, isFlashcardMode, Exam.exercices])

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isFlashcardMode) {
      if (currentFlashCardIdx < Exam.exercices.length - 1) {
        setCurrentFlashCardIdx(prev => prev + 1)
      } else {
        setIsExamComplete(true)
      }
    } else {
      if (currentExerciceIdx < Exam.exercices.length - 1) {
        setCurrentExerciceIdx(prev => prev + 1)
      } else {
        setIsExamComplete(true)
      }
    }
  }, [currentExerciceIdx, currentFlashCardIdx, isFlashcardMode, Exam.exercices.length])

  const goToPrevious = useCallback(() => {
    if (isFlashcardMode) {
      if (currentFlashCardIdx > 0) {
        setCurrentFlashCardIdx(prev => prev - 1)
      }
    } else {
      if (currentExerciceIdx > 0) {
        setCurrentExerciceIdx(prev => prev - 1)
      }
    }
  }, [currentExerciceIdx, currentFlashCardIdx, isFlashcardMode])

  const skipQuestion = useCallback(() => {
    goToNext()
  }, [goToNext])

  // Memoized callback for FillInGap onChange
  const handleFillInGapChange = useCallback((answers: string[]) => {
    handleAnswerSubmit(answers.join(','))
  }, [handleAnswerSubmit])

  // Memoized callback for FillInGap onCheck
  const handleFillInGapCheck = useCallback((answers: string[], isCorrect?: boolean) => {
    handleAnswerSubmit(answers.join(','), isCorrect)
  }, [handleAnswerSubmit])

  // Check if current question is answered
  const currentIndex = isFlashcardMode ? currentFlashCardIdx : currentExerciceIdx
  const isCurrentQuestionAnswered = selectedAnswers.has(currentIndex)

  // Render different question types
  const renderQuestion = () => {
    if (isFlashcardMode) {
      const currentIndex = currentFlashCardIdx
      return (
        <FlipCard
          question={currentExercice.content}
          answer={currentExercice.answer}
          handleValidationClick={handleAnswerSubmit}
          showResult={answerResults.has(currentIndex)}
          isCorrect={answerResults.get(currentIndex)}
        />
      )
    }

    switch (currentExercice.type) {
      case 'mcq':
        return (
          <MCQ
            content={currentExercice.content}
            options={currentExercice.options}
            selectedAnswer={selectedAnswers.get(currentIndex)}
            correctAnswer={currentExercice.answer}
            onAnswerSelect={handleAnswerSubmit}
            showResult={answerResults.has(currentIndex)}
            isCorrect={answerResults.get(currentIndex)}
          />
        )
      case 'yes/no':
        return (
          <TrueOrFalse
            content={currentExercice.content}
            options={currentExercice.options}
            selectedAnswer={selectedAnswers.get(currentIndex)}
            correctAnswer={currentExercice.answer}
            onAnswerSelect={handleAnswerSubmit}
            showResult={answerResults.has(currentIndex)}
            isCorrect={answerResults.get(currentIndex)}
          />
        )
      case 'fill-in':
        return (
          <FillInGap
            content={currentExercice.content}
            options={currentExercice.options}
            correctAnswers={[currentExercice.answer]}
            onChange={handleFillInGapChange}
            onCheck={handleFillInGapCheck}
          />
        )
      case 'flashcard':
        return (
          <FlipCard
            question={currentExercice.content}
            answer={currentExercice.answer}
            handleValidationClick={handleAnswerSubmit}
            showResult={answerResults.has(currentIndex)}
            isCorrect={answerResults.get(currentIndex)}
          />
        )
      default:
        return <div>Unknown question type</div>
    }
  }

  // Show analytics screen immediately when exam is complete
  if (isExamComplete || showResults) {
    // Create updated exam object with current results 
    const correctAnswers = Array.from(answerResults.values()).filter((v)=>v==true).length
    return (
      <ExamAnalyticsComp
        exam={Exam}
        analytics={
          {
            resultTrue: answerResults,
            resultForExercice: userAnswers,
            correctAnswer: correctAnswers,
            accuracy: Exam.exercices.length > 0
              ? Math.round(
                  (correctAnswers / Exam.exercices.length) * 100
                )
              : 0,
            incorrectAnswer: Exam.exercices.length - correctAnswers
          }
        }
        onRetry={() => {
          setIsExamComplete(false)
          setShowResults(false)
          setCurrentExerciceIdx(0)
          setCurrentFlashCardIdx(0)
          setSelectedAnswers(new Map())
          setAnswerResults(new Map())
          setUserAnswers(new Map())
        }}
        onViewLesson={() => {
          // Implement lesson viewing logic
          console.log('View lesson')
        }}
        onViewSummary={() => {
          // Implement summary viewing logic
          console.log('View summary')
        }}
        onQuestionClick={(questionIndex) => {
          setIsExamComplete(false)
          setShowResults(false)
          if (isFlashcardMode) {
            setCurrentFlashCardIdx(questionIndex)
          } else {
            setCurrentExerciceIdx(questionIndex)
          }
        }}
      />
    )
  }

  return (
    <main className="flex flex-col items-center min-h-full h-full text-white">
      <div className="w-full max-w-6xl">
        <h1 className='text-2xl text-center mt-4 mb-6'>{Exam.name}</h1>
        <ProgressBar lenght={Exam.exercices.length} res={answerResults} />

        <div className="mt-4 sm:mt-6 flex justify-center w-full overflow-hidden">
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className='w-full flex justify-between p-3 sm:p-6 max-w-[1200px] gap-3 sm:gap-4'>
          <button
            onClick={goToPrevious}
            disabled={isFlashcardMode ? currentFlashCardIdx === 0 : currentExerciceIdx === 0}
            className='w-full sm:w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronsLeft /> <p className='ml-2'>Previous</p>
          </button>

          <div className="flex gap-2">
            <button
              onClick={skipQuestion}
              className='w-full sm:w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'
            >
              <p className='mr-2'>Skip</p> <ChevronsRight />
            </button>

            {isCurrentQuestionAnswered && (
              <button
                onClick={goToNext}
                className='w-full sm:w-fit h-12 flex justify-center items-center p-2 rounded-md border border-green-500 bg-green-600/20 text-green-400 hover:bg-green-600/30'
              >
                <p className='mr-2'>Next</p> <ChevronsRight />
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="text-center text-sm text-gray-400 mt-4">
          {isFlashcardMode ? (
            <>Flashcard {currentFlashCardIdx + 1} of {Exam.exercices.length}</>
          ) : (
            <>Question {currentExerciceIdx + 1} of {Exam.exercices.length}</>
          )}
        </div>
      </div>
    </main>
  )
}

export default ExamComponant
