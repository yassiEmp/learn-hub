import React, { useState, useEffect } from 'react'
import { MCQProps } from '../../features/exam/utils/types'
import { CheckCircle, XCircle, Circle, Check, X } from 'lucide-react'

const MCQ = ({ options, content, selectedAnswer, correctAnswer, onAnswerSelect, showResult, isCorrect }: MCQProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedAnswer || null)

  // Update selected option when prop changes
  useEffect(() => {
    setSelectedOption(selectedAnswer || null)
  }, [selectedAnswer])

  const handleOptionClick = (option: string) => {
    if (onAnswerSelect && !showResult) {
      setSelectedOption(option)
      onAnswerSelect(option)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, option: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOptionClick(option)
    }
  }

  const getOptionState = (option: string) => {
    if (!showResult) {
      return selectedOption === option ? 'selected' : 'default'
    }
    
    if (option === correctAnswer) {
      return 'correct'
    }
    
    if (option === selectedOption && option !== correctAnswer) {
      return 'incorrect'
    }
    
    return 'default'
  }

  const getOptionStyles = (option: string) => {
    const state = getOptionState(option)
    const isHovered = hoveredOption === option && !showResult
    
    const baseStyles = "group relative w-full p-3 rounded-xl border-2 transition-all duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer overflow-hidden"
    
    switch (state) {
      case 'selected':
        return `${baseStyles} border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20`
      case 'correct':
        return `${baseStyles} border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20`
      case 'incorrect':
        return `${baseStyles} border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20`
      default:
        return `${baseStyles} border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 ${isHovered ? 'shadow-lg shadow-white/10' : ''}`
    }
  }

  const getIcon = (option: string) => {
    const state = getOptionState(option)
    
    switch (state) {
      case 'selected':
        return <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="currentColor" />
      case 'correct':
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
      case 'incorrect':
        return <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
      default:
        return <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-white/40" />
    }
  }

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, D...
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-5 overflow-hidden mcq-container">
      {/* Question Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <span className="text-xs sm:text-sm font-medium text-blue-400 uppercase tracking-wide">Question</span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white leading-tight px-2">
          {content}
        </h2>
      </div>

      {/* Options Container */}
      <div className="space-y-2">
        {options.map((option, index) => {
          // const state = getOptionState(option)
          const isSelected = selectedOption === option
          // const isCorrect = option === correctAnswer
          // const isIncorrect = option === selectedOption && option !== correctAnswer
          
          return (
            <div
              key={index}
              className={getOptionStyles(option)}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              onMouseEnter={() => setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              tabIndex={showResult ? -1 : 0}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${getOptionLetter(index)}: ${option}`}
            >
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 w-full">
                {/* Option Letter */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-semibold text-white/80 text-sm sm:text-base">
                  {getOptionLetter(index)}
                </div>
                
                {/* Option Text */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-white mcq-option-text leading-relaxed">
                    {option}
                  </p>
                </div>
                
                {/* Status Icon */}
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                  {getIcon(option)}
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              {isSelected && !showResult && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-xl animate-pulse" />
              )}
            </div>
          )
        })}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${
          isCorrect 
            ? 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20' 
            : 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
        }`}>
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-base font-semibold ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {!isCorrect && correctAnswer && (
                <p className="text-white/80 mt-1 text-sm break-words">
                  The correct answer is: <span className="font-semibold text-white">{correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Instructions */}
      {!showResult && (
        <div className="text-center text-xs text-white/60 px-2">
          <p>Use arrow keys to navigate or click to select an option</p>
        </div>
      )}
    </div>
  )
}

export default MCQ
