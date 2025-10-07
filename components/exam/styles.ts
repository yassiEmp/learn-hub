import { cva } from 'class-variance-authority'
import { ButtonVariant } from './types'

export const buttonVarient = cva(
  "w-full rounded-md transition-colors flex p-4 items-center mt-1 mb-1",
  {
    variants: {
      isTrue: {
        true: "ring-2 ring-green-400 ring-offset-2 ring-offset-gray-950 bg-green-300/40 text-black",
        false: "ring-2 ring-red-400 ring-offset-2 ring-offset-gray-950 bg-red-300/40 text-black",
        selected: "ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-950 bg-blue-300/40 text-black",
        nonSelected: " bg-white/5 border border-white/10 hover:bg-white/15 "
      }
    },
    defaultVariants: {
      isTrue: "nonSelected"
    }
  }
)

export const getButtonVariant = (option: string, selectedAnswer?: string, correctAnswer?: string, showResult?: boolean): ButtonVariant => {
  if (!showResult) {
    return selectedAnswer === option ? "selected" : "nonSelected"
  }
  
  if (option === correctAnswer) {
    return "true"
  }
  
  if (option === selectedAnswer && option !== correctAnswer) {
    return "false"
  }
  
  return "nonSelected"
}
