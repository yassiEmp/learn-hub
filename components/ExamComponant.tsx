import React, { useMemo, useState } from 'react'
import ProgressBar from './ProgressBar'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cva } from 'class-variance-authority'

// this receive an object containing all the information needed to take an exam 
export type Exam = {
  id: string,
  name: string,
  exercices: exercice[],
  mode: 'flashCard' | 'Exercice',
  currentFlashCard: number,
  currentExercice: number,
  resultForExercice: Map<number, string>, // map the exercise index to the given answer
  resultTrue: Map<number, boolean>, // say if the result is correct or not
  gradeAnalitycs: analitycs, // a map that show true or false for each question so that you know if you got it right or not 
}

type exercice = {
  type: "fill-in" | "yes/no" | "mcq" | "flashcard",
  answer: string, // the answer of the question
  options: string[], // the different options to chose from
  content: string // the question that the user should answer 
}

type analitycs = {
  accuracy: number,
  correctAnswer: number,
  incorrectAnswer: number,
}

const buttonVarient = cva(
  "w-full rounded-md transition-colors flex p-4 items-center mt-1 mb-1",
  {
    variants: {
      isTrue: {
        true: "ring-2 ring-green-400 ring-offset-2 ring-offset-gray-950 bg-green-300/40 text-black",
        false: "ring-2 ring-red-400 ring-offset-2 ring-offset-gray-950 bg-red-300/40 text-black",
        nonSelected: " bg-white/5 border border-white/10 hover:bg-white/15 "
      }
    },
    defaultVariants: {
      isTrue: "nonSelected"
    }
  }
)

const ExamComponant = ({ Exam }: { Exam: Exam }) => {
  const [currentExerciceIdx] = useState<number>(2)
  const currentExercice = Exam.exercices[currentExerciceIdx]
  // kept for potential future use
  // const contArr = currentExercice.content.split("____")
  return (
    <main className="flex flex-col items-center">
      <h1 className='text-2xl text-center mt-4'>{Exam.name}</h1>
      <ProgressBar lenght={Exam.exercices.length} res={Exam.resultTrue} />
      {/* MCQ type componant start here */}
      {currentExercice.type === 'fill-in' && (
        <FillInGap content={currentExercice.content} options={currentExercice.options} />
      )}

      {/* add a flotting modal on the bottom for all the quick mode and flashcard mode stuff */}
    </main>
  )
}

export default ExamComponant

interface MCQProps {
  content: string,
  options: string[]
}

const MCQ = ({ options, content }: MCQProps) => {
  return (
    <>
      <div className='w-full max-w-[1200px] flex flex-col items-center mt-2 p-5'>
        <p className='text-3xl text-white/70'>Question</p>
        <h2 className='text-4xl text-white mt-2 text-center mb-2'>{content}</h2>
        <div className="w-full h-28 hover:border hover:border-green-300 rounded-md">

        </div>
        <div className='flex flex-col gap-2 h-full w-full mt-2.5'>
          {options.map((opt, idx) => {
            return (
              <div key={idx} className={buttonVarient()} >
                <div className="w-8 h-8 mr-2 rounded-md text-2xl grid place-items-center text-center text-shadow-white border border-white/20"><p>{idx + 1}</p></div> <p className='text-xl'>{opt}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='w-full flex justify-between p-10 max-w-[1200px]'>
        <div className='w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
          <ChevronsLeft /> <p className='ml-2'>Previous</p>
        </div>
        <div className='w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
          <p className='mr-2'>Skip</p> <ChevronsRight />
        </div>
      </div>
    </>
  )
}

export { MCQ }

interface TrueOrFalseProps {
  content: string,
  options: string[]
}

const TrueOrFalse = ({ content, options }: TrueOrFalseProps) => {
  return (
    <>
      <div className='w-full max-w-[1200px] flex flex-col items-center mt-2 p-5'>
        <p className='text-3xl text-white/70'>Affirmation</p>
        <h2 className='text-4xl text-white mt-2 text-center mb-2'>{content}</h2>
        <div className="w-full h-28 hover:border hover:border-green-300 rounded-md">

        </div>
        <div className='flex gap-2 h-full w-full mt-2.5'>
          {options.map((opt, idx) => {
            return (
              <div key={idx} className={buttonVarient()} >
                <div className="w-8 h-8 mr-2 rounded-md text-2xl grid place-items-center text-center text-shadow-white border border-white/20"><p>{idx + 1}</p></div> <p className='text-xl'>{opt}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='w-full flex justify-between p-10 max-w-[350px]'>
        <div className='w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
          <ChevronsLeft /> <p className='ml-2'>Previous</p>
        </div>
        <div className='w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
          <p className='mr-2'>Skip</p> <ChevronsRight />
        </div>
      </div>
    </>
  )
}

export { TrueOrFalse }

// <FlipCard answer={currentExercice.answer} question={currentExercice.content} handleValidationClick={() => { }} />

import { Card, CardContent } from "./ui/card"
import styles from './card-component.module.css';

type TFlipCard = {
  handleValidationClick: (arg0: string) => void,
  question: string,
  answer: string,
  // isFlipped: boolean
}
export function FlipCard({ question, answer, handleValidationClick }: TFlipCard) {
  const [isFlipped, setIsFlipped] = useState(false)
  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }
  return <div
    className={`w-10/12 mt-12 h-[400px] sm:h-[500px] flex justify-center items-center relative cursor-pointer ${styles['perspective-1000']} flex flex-col`}

  >
    <div onClick={handleClick} className={` max-w-[926px] w-full h-full transition-transform duration-500 ${styles['transform-style-3d']} ${isFlipped ? styles['rotate-y-180'] : ''} animate-bounce-in`}>

      {/* Front of card */}
      <Card className={`bg-blue-400/10 w-full h-full text-center flex justify-center items-center absolute ${styles['backface-hidden']} p-2 sm:p-6`}>
        <CardContent className='text-lg sm:text-xl md:text-2xl font-medium'>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">Question</span>
            <div className="break-words">{question}</div>
          </div>
        </CardContent>
      </Card>

      {/* Back of card */}
      <Card className={`w-full h-full text-center flex justify-center items-center absolute ${styles['backface-hidden']} ${styles['rotate-y-180']} bg-blue-50/10 p-2 sm:p-6`}>
        <CardContent className='text-lg sm:text-xl md:text-2xl font-medium'>
          <div className="flex flex-col gap-2 mt-5">
            <span className="text-sm text-gray-400">Answer</span>
            <div className="break-words">{answer}</div>
          </div>
          <div className='w-full flex justify-between pt-5 max-w-[350px] text-sm'>
            <div onClick={(e) => {
              e.stopPropagation()
              handleValidationClick("right")
            }} className='w-32 ml-2 mr-2 h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
              <p className=''>I knew it</p>
            </div>
            <div onClick={(e) => {
              e.stopPropagation()
              handleValidationClick("wrong")
            }} className='w-32 ml-2 mr-2 h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
              <p className=''>I didn&apos;t knew it</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
    <div className='w-full flex justify-between pt-10 pb-10 max-w-[350px]'>
      <div className='w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
        <ChevronsLeft /> <p className='ml-2'>Previous</p>
      </div>
      <div className='w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40'>
        <p className='mr-2'>Skip</p> <ChevronsRight />
      </div>
    </div>
    <p className='text-gray-400'>Click on the card to see the {isFlipped ? "Question" : "answer"}</p>
  </div>
}




import { Button } from './ui/Button'
import Image from 'next/image'

type FillInGapProps = {
  content: string,
  options: string[],
  // Optional list of correct answers for each blank (in order)
  correctAnswers?: string[],
  // Optional callbacks
  onChange?: (answers: string[]) => void,
  onCheck?: (answers: string[], isCorrect?: boolean) => void
}

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
      // clear and set new value for the target blank
      next[blankIndex] = value
      const result = next
      if (onChange) onChange(result)
      // freeing previous is implicit via usedOptions recompute
      return result
    })
  }

  const handleDropIntoBlank = (blankIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.dataTransfer.getData('text/plain')
    if (!text) return
    if (usedOptions.has(text) && blanks[blankIndex] !== text) return
    setBlankValue(blankIndex, text)
  }

  const handleOptionClick = (opt: string) => {
    if (usedOptions.has(opt)) return
    // Mobile-first: toggle select; placing happens on blank tap
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
    if (onChange) onChange(Array(blanksCount).fill(''))
  }

  return (
    <>
      <div className='w-full max-w-[1200px] flex flex-col items-center mt-2 p-3 sm:p-5'>
        <p className='text-xl sm:text-2xl text-white/70'>Question</p>
        <h2 className='text-lg sm:text-2xl text-white mt-2 text-center mb-2 leading-relaxed'>
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
                    className={`inline-block min-w-16 sm:min-w-22 w-fit px-2 py-1 sm:py-2 rounded-md min-h-8 h-fit border align-middle touch-manipulation select-none ${
                      selectedOption ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                    } ${
                      checked && typeof isCorrect !== 'undefined'
                        ? (blanks[idx] && correctAnswers ? (blanks[idx] === correctAnswers[idx] ? 'bg-green-500/30 border-green-700/40' : 'bg-red-500/30 border-red-700/40') : 'bg-blue-500/30 border-gray-700/40')
                        : 'bg-blue-500/30 border-gray-700/40'
                    }`}
                  >
                    {blanks[idx] || <span className='text-white/60 text-sm sm:text-base'>tap here</span>}
                  </div>
                </React.Fragment>
              )
            } else {
              return <span key={idx}>{el}</span>
            }
          })}
        </h2>
        {selectedOption && (
          <div className='mt-4 p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg'>
            <p className='text-yellow-200 text-sm text-center'>
              Selected: <span className='font-semibold'>{selectedOption}</span> - Tap a blank to place it
            </p>
          </div>
        )}
        {checked && typeof isCorrect !== 'undefined' && (
          <div className={`mt-2 text-sm text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'All answers are correct.' : 'Some answers are incorrect.'}
          </div>
        )}
        <div className='flex flex-col sm:flex-row gap-2 mt-6 mb-2 w-full max-w-md justify-center'>
          <Button 
            onClick={handleCheck} 
            disabled={!allFilled} 
            className='bg-blue-500 hover:bg-blue-500/70 border border-blue-800 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation'
          >
            Check
          </Button>
          <Button 
            onClick={handleReset} 
            variant='secondary' 
            className='border border-white/10 touch-manipulation'
          >
            Reset
          </Button>
        </div>
        <div className="w-full h-16 sm:h-28 hover:border hover:border-green-300 rounded-md" />

        <div className='w-full flex flex-col sm:flex-row sm:flex-wrap justify-center sm:justify-start mt-6 mb-6 max-w-[1200px] gap-2 sm:gap-4'>
          {shuffledOptions.map((opt, idx) => {
            return (
              <div
                key={idx}
                draggable={!usedOptions.has(opt)}
                onDragStart={(e) => {
                  if (usedOptions.has(opt)) {
                    e.preventDefault()
                    return
                  }
                  e.dataTransfer.setData('text/plain', opt)
                }}
                onClick={() => handleOptionClick(opt)}
                onTouchStart={(e) => {
                  if (usedOptions.has(opt)) e.preventDefault()
                }}
                aria-disabled={usedOptions.has(opt)}
                className={`flex select-none w-full sm:w-fit p-3 sm:p-2 rounded-md border-white/35 border-1 touch-manipulation transition-all ${
                  selectedOption === opt 
                    ? 'bg-yellow-500/30 border-yellow-400/70 ring-2 ring-yellow-400/50' 
                    : usedOptions.has(opt) 
                      ? 'bg-black/20 text-white/40 cursor-not-allowed' 
                      : 'bg-black/60 cursor-pointer hover:bg-black/70 active:scale-95'
                }`}
              >
                <Image 
                  draggable='false' 
                  src="/buttonDot.svg" 
                  alt='' 
                  width="10" 
                  height="80" 
                  className='mr-2 flex-shrink-0' 
                /> 
                <p className='text-sm sm:text-base break-words'>{opt}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='w-full flex flex-col sm:flex-row justify-between p-4 sm:p-10 max-w-[1200px] gap-4'>
        <div className='w-full sm:w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40 touch-manipulation'>
          <ChevronsLeft /> <p className='ml-2'>Previous</p>
        </div>
        <div className='w-full sm:w-fit h-12 flex justify-center items-center p-2 rounded-md border hover:border-white/20 border-white/10 bg-black/40 touch-manipulation'>
          <p className='mr-2'>Skip</p> <ChevronsRight />
        </div>
      </div>
    </>
  )
}



