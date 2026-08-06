import { CreateExam } from "./types"
import { createAiClient } from "../ai/ai";

export const createExam: CreateExam = async (content) => {
    // A fresh client per request. Sharing one across requests leaked exam state
    // between users on warm serverless instances.
    const aiClient = createAiClient({ cost: "high" })
    const exam = await aiClient.generateExam(content)

    if (!exam){
        return {
            id: "dummy-exam-retry",
            title: "Exam Generation Failed - Please Retry",
            exercises: [
                {
                    type: "flashcard",
                    content: "Exam generation failed. Please try again.",
                    answer: "Retry the exam generation process."
                }
            ]
        }
    }
    return exam
}

/**
 * Generate an exam and its explanations together.
 *
 * Explanations need the conversation state from the exam that produced them, so
 * both calls must share one client. The previous standalone generateExplanation()
 * relied on singleton state left over from an earlier request and could not work
 * correctly; it had no callers.
 */
export const createExamWithExplanations = async (content: string, additionalContext?: string) => {
    const aiClient = createAiClient({ cost: "high" })
    const exam = await aiClient.generateExam(content)
    if (!exam) return { exam: null, explanations: null }

    const explanations = await aiClient.generateExplanation(additionalContext)
    return { exam, explanations }
}
