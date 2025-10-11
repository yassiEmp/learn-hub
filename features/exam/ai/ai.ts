//===================
// a abstraction layer over ai for exam genaration 
// call this using method like .generateExam(content,{cost:High|small,speed:Quick|slow,exerciceAmount:number}) 
//=================== 
import { z } from "zod";
import prompt from "./prompt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

//======================
// 🧠 zod schema for ai
//======================

//---------------------
// 🧠 zod schema for exam 

const fillInSchema = z.object({
    type: z.literal('fill-in').describe("Type of exercise: fill-in-the-blank"),
    content: z.string().describe("The question or prompt for the fill-in-the-blank exercise use ____ for the blank"),
    options: z.array(z.string()).describe("Possible options for the blank (can be empty or distractors)"),
    answer: z.string().describe("The correct answer for the blank")
}).describe("A fill-in-the-blank exercise");

const trueFalseSchema = z.object({
    type: z.literal('true/false').describe("Type of exercise: true/false"),
    content: z.string().describe("The statement to be judged as true or false"),
    answer: z.enum(['true', 'false']).describe("The correct answer: 'true' or 'false'")
}).describe("A true/false exercise");

const mcqSchema = z.object({
    type: z.literal('mcq').describe("Type of exercise: multiple choice question"),
    content: z.string().describe("The question or prompt for the MCQ"),
    options: z.array(z.string()).describe("Array of possible answer options"),
    answer: z.string().describe("The correct answer (must match one of the options)")
}).describe("A multiple choice question exercise");

const flashcardSchema = z.object({
    type: z.literal('flashcard').describe("Type of exercise: flashcard"),
    content: z.string().describe("The front/content of the flashcard"),
    answer: z.string().describe("The answer or back of the flashcard")
}).describe("A flashcard exercise");

const cleanExerciseSchema = z.discriminatedUnion('type', [
    fillInSchema,
    trueFalseSchema,
    mcqSchema,
    flashcardSchema
]).describe("A discriminated union of all supported exercise types");

const examSchema = z.object({
    id: z.string().describe("Unique identifier for the exam"),
    title: z.string().describe("Title of the exam"),
    exercises: z.array(cleanExerciseSchema).describe("Array of exercises in the exam")
}).describe("Schema for a complete exam object");

// 🧠 zod schema for exam 
//---------------------

//---------------------
//🧠 zod schema for explanation 

const mcqExplanationSchema = z
    .object({
        type: z
            .literal('mcq')
            .describe("Type of exercise: multiple choice question"),
        explanations: z
            .record(z.string(), z.string())
            .describe("Map of option index to explanation for each option")
    })
    .describe("MCQ explanation with option-specific feedback");

const fillInExplanationSchema = z
    .object({
        type: z
            .literal('fill-in')
            .describe("Type of exercise: fill-in-the-blank"),
        explanations: z
            .record(z.string(), z.string())
            .describe("Map of option index to explanation for each option")
    })
    .describe("Fill-in explanation with option-specific feedback");

const trueFalseExplanationSchema = z
    .object({
        type: z.
            literal('true/false').
            describe("Type of exercise: true/false"),
        explanation: z
            .string()
            .describe("Explanation of why the statement is true or false")
    })
    .describe("True/False explanation");

const flashcardExplanationSchema = z
    .object({
        type: z
            .literal('flashcard')
            .describe("Type of exercise: flashcard"),
        explanation: z
            .string()
            .describe("Elaboration or mnemonic to help remember the answer")
    })
    .describe("Flashcard explanation with memory aid");

const ExerciceExplanationSchema = z
    .discriminatedUnion('type', [
        mcqExplanationSchema,
        fillInExplanationSchema,
        trueFalseExplanationSchema,
        flashcardExplanationSchema
    ])
    .describe("A discriminated union of all supported explanation types");

const ExerciceExplanationMapSchema = z
    .record(z.string(), ExerciceExplanationSchema)
    .describe("A map from exercise index to its explanation object, for all supported exercise types");

// 🧠 zod schema for explanation 
//---------------------


//=========================
// 🧠 output parser for ai
//=========================

const examParser = StructuredOutputParser.fromZodSchema(examSchema)
const explanationParser = StructuredOutputParser.fromZodSchema(ExerciceExplanationMapSchema)

//=========================
// 🧠 prompt for ai
//=========================
const examGenPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", prompt.system + " here is a custom book you can take some insight from: " + prompt.book],
    ["user", prompt.user]
])
// Removed unused explanationGenPromptTemplate as we now build prompts dynamically

class AiClient {
    private llm: ChatGoogleGenerativeAI;
    private config;
    private chain: ReturnType<typeof examGenPromptTemplate.pipe> | undefined;
    private conversationHistory: Array<HumanMessage | AIMessage> = [];
    private examContent: string = "";
    private generatedExam: unknown = null;
    
    constructor(config: { cost: "high" | "low", speed?: "fast" | "moderate" }) {
        this.llm = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash-exp",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.2,
            maxOutputTokens: 40000,
        });
        this.config = config;
    }



    async generateExam(content: string) {
        this.chain = examGenPromptTemplate.pipe(this.llm)
        this.examContent = content;
        
        // Store the initial conversation context
        this.conversationHistory = [
            new HumanMessage(`Content: ${content}\n\nGenerate 20 exercises following the format: ${examParser.getFormatInstructions()}`)
        ];
        
        let response;
        try {
            response = await this.chain.pipe(examParser).invoke({
                content: content,
                formatInstruction: examParser.getFormatInstructions(),
                nbrOfExercice: "20"
            })
            
            // Store the generated exam and add AI response to conversation history
            this.generatedExam = response;
            this.conversationHistory.push(new AIMessage(JSON.stringify(response)));
            
        } catch (error) {
            console.log("error while calling the llm chain for exam generation: ", error)
        }
        console.log(response)
        return response
    }
    async generateExplanation(additionalContext?: string) {
        if (!this.generatedExam) {
            console.log("No exam generated yet. Please generate an exam first.");
            return null;
        }

        // Add any additional context to the conversation history
        if (additionalContext) {
            this.conversationHistory.push(new HumanMessage(additionalContext));
        }

        // Create a comprehensive prompt that includes all conversation context
        const contextPrompt = this.buildExplanationPrompt();
        
        switch (this.config.cost) {
            case "high": {
                try {
                    // Use the conversation history to provide context
                    const messages = [
                        ...this.conversationHistory,
                        new HumanMessage(contextPrompt)
                    ];
                    
                    const response = await this.llm.invoke(messages);
                    const parsedExplanation = await explanationParser.parse(response.content as string);
                    
                    // Add the explanation to conversation history
                    this.conversationHistory.push(new AIMessage(JSON.stringify(parsedExplanation)));
                    
                    return parsedExplanation;
                } catch (error) {
                    console.log("error while generating explanation: ", error);
                    return null;
                }
            }
            case "low": {
                // Generate dummy explanation
                const dummyExplanation = this.generateDummyExplanation();
                this.conversationHistory.push(new AIMessage(JSON.stringify(dummyExplanation)));
                return dummyExplanation;
            }
        }
    }

    private buildExplanationPrompt(): string {
        return `${prompt.explanation}

Previous conversation context:
${this.conversationHistory.map(msg => 
    msg instanceof HumanMessage ? `Human: ${msg.content}` : `AI: ${msg.content}`
).join('\n\n')}

Format instructions: ${explanationParser.getFormatInstructions()}`;
    }

    private generateDummyExplanation(): Record<number, unknown> {
        if (!this.generatedExam || !(this.generatedExam as { exercises?: unknown[] }).exercises) {
            return {};
        }

        const explanations: Record<number, unknown> = {};
        const exercises = (this.generatedExam as { exercises: unknown[] }).exercises;
        exercises.forEach((exercise: unknown, index: number) => {
            const exerciseObj = exercise as { type: string };
            switch (exerciseObj.type) {
                case 'mcq':
                    explanations[index] = {
                        type: 'mcq',
                        explanations: {
                            'A': 'This option is incorrect. Please review the concept.',
                            'B': 'This option is incorrect. Please review the concept.',
                            'C': 'This option is incorrect. Please review the concept.',
                            'D': 'This option is incorrect. Please review the concept.'
                        }
                    };
                    break;
                case 'fill-in':
                    explanations[index] = {
                        type: 'fill-in',
                        explanations: {
                            'A': 'This is a common misconception. The correct answer requires understanding of the core concept.',
                            'B': 'This is a common misconception. The correct answer requires understanding of the core concept.'
                        }
                    };
                    break;
                case 'true/false':
                    explanations[index] = {
                        type: 'true/false',
                        explanation: 'This statement is incorrect. Please review the fundamental concepts to understand why.'
                    };
                    break;
                case 'flashcard':
                    explanations[index] = {
                        type: 'flashcard',
                        explanation: 'This is a key concept that requires memorization. Try using mnemonic devices or spaced repetition.'
                    };
                    break;
            }
        });

        return explanations;
    }

    // Method to add more context to the conversation
    addContextToConversation(context: string) {
        this.conversationHistory.push(new HumanMessage(context));
    }

    // Method to get the current conversation history
    getConversationHistory() {
        return this.conversationHistory;
    }

    // Method to clear conversation history
    clearConversationHistory() {
        this.conversationHistory = [];
    }
}
const aiClient = new AiClient({ cost: "high" })
export default aiClient 