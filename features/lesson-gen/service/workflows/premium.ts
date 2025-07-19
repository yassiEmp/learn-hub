// import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { LessonInput, Lesson } from '../types';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { Result } from '../types';

// Zod schema
const LessonSchema = z.object({
  title: z.string(),
  content: z.string(),
  summary: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  resources: z.array(z.string()).optional(),
});

// AI Model
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.4,
  maxOutputTokens: 100000
});

// Bind the schema to the model for structured output
const llmWithStructure = llm.withStructuredOutput(LessonSchema);

const CONCURRENCY_LIMIT = 2; // or 3, etc.

export async function* generateLessonsPremium(
  input: LessonInput
): AsyncGenerator<Result<Lesson>, void, unknown> {
  const { content, lessonTitles } = input;
  if (!lessonTitles || lessonTitles.length === 0) {
    yield { err: new Error("lessonTitles array is required"), res: null };
    return;
  }

  for (let i = 0; i < lessonTitles.length; i += CONCURRENCY_LIMIT) {
    const batch = lessonTitles.slice(i, i + CONCURRENCY_LIMIT);
    const results = await Promise.all(batch.map(async (title) => {
      try {
        const language = input.language || 'en';
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an expert educator. Generate a lesson based on the given Text and title. All output must be in the following language: ${language}.
Return JSON with:
- title: string // the given title 
- content: string // a consise and explicative content for the lesson that help to learn and master the Text understand the nuances the way to think about it  
- summary: string (optional) // a sumary of the lesson
- objectives: string[] (optional) // the objectives of the lesson 
- resources: string[] (optional)`],
          ["human", "Title: {title} \n\n Content: {content}"]
        ]);
        const promptValue = await prompt.invoke({ content, title });
        const lesson = await llmWithStructure.invoke(promptValue);
        return { err: null, res: lesson };
      } catch (error) {
        return { err: error as Error, res: null };
      }
    }));
    for (const result of results) {
      yield result;
    }
  }
}
