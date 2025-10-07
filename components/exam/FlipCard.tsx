import React, { useState } from 'react'
import { FlipCardProps } from './types'
import { CheckCircle, XCircle, RotateCcw, Eye, EyeOff, Check, X } from 'lucide-react'

export function FlipCard({ question, answer, handleValidationClick, showResult, isCorrect }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleValidation = (response: string) => {
    const isCorrect = response === "right"
    handleValidationClick(response, isCorrect)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-5 overflow-hidden mcq-container">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <span className="text-xs sm:text-sm font-medium text-purple-400 uppercase tracking-wide">Flashcard</span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-tight px-2">
          {isFlipped ? 'Answer' : 'Question'}
        </h2>
      </div>

      {/* Card Container */}
      <div className="flex justify-center">
        <div 
          className="relative w-full max-w-2xl h-[250px] sm:h-[300px] cursor-pointer group"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Click to ${isFlipped ? 'show question' : 'show answer'}`}
        >
          {/* Card */}
          <div 
            className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
            style={{ 
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            
            {/* Front of card (Question) */}
            <div 
              className="absolute inset-0 w-full h-full rounded-2xl border-2 border-white/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">Question</span>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-medium text-white mcq-option-text leading-relaxed">
                  {question}
                </div>
                <div className="mt-6 flex items-center space-x-2 text-sm text-white/60">
                  <RotateCcw className="w-4 h-4" />
                  <span>Click to reveal answer</span>
                </div>
              </div>
            </div>

            {/* Back of card (Answer) */}
            <div 
              className="absolute inset-0 w-full h-full rounded-2xl border-2 border-white/20 bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="flex items-center space-x-2 mb-4">
                  <EyeOff className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-green-400 uppercase tracking-wide">Answer</span>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-medium text-white mcq-option-text leading-relaxed mb-6">
                  {answer}
                </div>
                
                {/* Validation Buttons */}
                {!showResult && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleValidation("right")
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-green-500/50 bg-green-500/10 hover:bg-green-500/20 transition-all duration-200 group"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-green-400">I knew it</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleValidation("wrong")
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 group"
                    >
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="font-medium text-red-400">I didn&apos;t know it</span>
                    </button>
                  </div>
                )}

                {/* Result Feedback */}
                {showResult && (
                  <div className={`w-full max-w-md p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCorrect 
                      ? 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20' 
                      : 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
                  }`}>
                    <div className="flex items-center justify-center space-x-3">
                      {isCorrect ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <X className="w-6 h-6 text-red-400" />
                      )}
                      <p className={`text-lg font-semibold ${
                        isCorrect ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isCorrect ? 'You knew it!' : 'You didn\' t know it'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
