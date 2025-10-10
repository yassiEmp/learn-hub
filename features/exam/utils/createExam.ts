import { CreateExam } from "./types"
import aiClient from "../ai/ai";

export const createExam: CreateExam = async (content) => {
    console.log(content)
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

// Separate function for generating explanations on-demand
export const generateExplanation = async (additionalContext?: string) => {
    return await aiClient.generateExplanation(additionalContext)
}