import React, { useMemo, useState, useEffect } from 'react'
import { FillInGapProps } from '../../features/exam/utils/types'
import { CheckCircle, RotateCcw, Check, X, GripVertical } from 'lucide-react'

export const FillInGap = ({ content, options, correctAnswers, onChange, onCheck }: FillInGapProps) => {
  const contArr = content.split('____')
  const blanksCount = Math.max(contArr.length - 1, 0)
  const [blanks, setBlanks] = useState<string[]>(() => Array(blanksCount).fill(''))
  const [checked, setChecked] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Shuffle options once for better UX predictability
  const shuffledOptions = useMemo(() => {
    const arr = [...options]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [options])

  const usedOptions = useMemo(() => new Set(blanks.filter(Boolean)), [blanks])

  const setBlankValue = (blankIndex: number, value: string) => {
    setChecked(false)
    setBlanks(prev => {
      const next = [...prev]
      next[blankIndex] = value
      return next
    })
  }

  // Call onChange after blanks state has been updated
  useEffect(() => {
    if (onChange) {
      onChange(blanks)
    }
  }, [blanks, onChange])

  const handleDropIntoBlank = (blankIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.dataTransfer.getData('text/plain')
    if (!text) return
    if (usedOptions.has(text) && blanks[blankIndex] !== text) return
    setBlankValue(blankIndex, text)
  }

  const handleOptionClick = (opt: string) => {
    if (usedOptions.has(opt)) return
    setSelectedOption(prev => (prev === opt ? null : opt))
  }

  const clearBlank = (idx: number) => {
    if (!blanks[idx]) return
    setBlankValue(idx, '')
  }

  const handleBlankClick = (blankIndex: number) => {
    if (selectedOption && !usedOptions.has(selectedOption)) {
      setBlankValue(blankIndex, selectedOption)
      setSelectedOption(null)
      return
    }
    clearBlank(blankIndex)
  }

  const allFilled = blanksCount === 0 || blanks.every(Boolean)

  const isCorrect = useMemo(() => {
    if (!correctAnswers || correctAnswers.length !== blanks.length) return undefined
    return blanks.every((b, i) => b === correctAnswers[i])
  }, [blanks, correctAnswers])

  const handleCheck = () => {
    setChecked(true)
    if (onCheck) onCheck(blanks, isCorrect)
  }

  const handleReset = () => {
    setBlanks(Array(blanksCount).fill(''))
    setChecked(false)
    setSelectedOption(null)
  }

  const getBlankState = (blankIndex: number) => {
    if (!checked || typeof isCorrect === 'undefined') return 'default'
    if (!blanks[blankIndex]) return 'empty'
    if (correctAnswers && blanks[blankIndex] === correctAnswers[blankIndex]) return 'correct'
    return 'incorrect'
  }

  const getBlankStyles = (blankIndex: number) => {
    const state = getBlankState(blankIndex)
    const hasSelectedOption = selectedOption !== null
    
    const baseStyles = "inline-block min-w-20 sm:min-w-24 w-fit px-3 py-2 rounded-lg min-h-10 h-fit border-2 align-middle touch-manipulation select-none transition-all duration-200 cursor-pointer"
    
    switch (state) {
      case 'correct':
        return `${baseStyles} border-green-500 bg-green-500/20 text-green-100`
      case 'incorrect':
        return `${baseStyles} border-red-500 bg-red-500/20 text-red-100`
      case 'empty':
        return `${baseStyles} border-yellow-500 bg-yellow-500/20 text-yellow-100`
      default:
        return `${baseStyles} border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15 ${
          hasSelectedOption ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
        }`
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-5 overflow-hidden mcq-container">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wide">Fill in the Gap</span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-tight px-2">
          Complete the sentence by filling in the blanks
        </h2>
      </div>

      {/* Question Content */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
        <div className="text-lg sm:text-xl text-white leading-relaxed mcq-option-text">
          {contArr.map((el, idx) => {
            if (idx !== contArr.length - 1) {
              return (
                <React.Fragment key={idx}>
                  <span>{el}</span>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropIntoBlank(idx, e)}
                    onClick={() => handleBlankClick(idx)}
                    onTouchStart={(e) => e.preventDefault()}
                    role='button'
                    tabIndex={0}
                    aria-label={`Blank ${idx + 1}${blanks[idx] ? ` filled with ${blanks[idx]}` : ' empty'}`}
                    className={getBlankStyles(idx)}
                  >
                    {blanks[idx] || (
                      <span className='text-white/60 text-sm sm:text-base flex items-center justify-center h-full'>
                        {selectedOption ? 'Tap to place' : 'Click here'}
                      </span>
                    )}
                  </div>
                </React.Fragment>
              )
            } else {
              return <span key={idx}>{el}</span>
            }
          })}
        </div>
      </div>

      {/* Selected Option Indicator */}
      {selectedOption && (
        <div className='p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-xl'>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-yellow-400" />
            <p className='text-yellow-200 text-sm'>
              Selected: <span className='font-semibold'>{selectedOption}</span> - Tap a blank to place it
            </p>
          </div>
        </div>
      )}

      {/* Result Feedback */}
      {checked && typeof isCorrect !== 'undefined' && (
        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
          isCorrect 
            ? 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20' 
            : 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
        }`}>
          <div className="flex items-center space-x-3">
            {isCorrect ? (
              <Check className="w-6 h-6 text-green-400" />
            ) : (
              <X className="w-6 h-6 text-red-400" />
            )}
            <p className={`text-lg font-semibold ${
              isCorrect ? 'text-green-400' : 'text-red-400'
            }`}>
              {isCorrect ? 'All answers are correct!' : 'Some answers are incorrect.'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto'>
        <button 
          onClick={handleCheck} 
          disabled={!allFilled} 
          className='flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group'
        >
          <CheckCircle className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-blue-400">Check Answers</span>
        </button>
        <button 
          onClick={handleReset} 
          className='flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 group'
        >
          <RotateCcw className="w-5 h-5 text-white/80" />
          <span className="font-medium text-white/80">Reset</span>
        </button>
      </div>

      {/* Options Container */}
      <div className='w-full'>
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Available Options</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {shuffledOptions.map((opt, idx) => {
            const isUsed = usedOptions.has(opt)
            const isSelected = selectedOption === opt
            
            return (
              <div
                key={idx}
                draggable={!isUsed}
                onDragStart={(e) => {
                  if (isUsed) {
                    e.preventDefault()
                    return
                  }
                  e.dataTransfer.setData('text/plain', opt)
                }}
                onClick={() => handleOptionClick(opt)}
                onTouchStart={(e) => {
                  if (isUsed) e.preventDefault()
                }}
                aria-disabled={isUsed}
                className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                  isSelected 
                    ? 'border-yellow-500 bg-yellow-500/20 ring-2 ring-yellow-400/50' 
                    : isUsed 
                      ? 'border-white/10 bg-white/5 text-white/40 cursor-not-allowed' 
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 cursor-pointer active:scale-95'
                }`}
              >
                <GripVertical className="w-4 h-4 text-white/60 flex-shrink-0" />
                <p className='text-sm sm:text-base mcq-option-text flex-1'>{opt}</p>
                {isUsed && (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Accessibility Instructions */}
      {!checked && (
        <div className="text-center text-xs sm:text-sm text-white/60 px-2">
          <p>Click an option to select it, then click a blank to place it. You can also drag and drop options.</p>
        </div>
      )}
    </div>
  )
}
