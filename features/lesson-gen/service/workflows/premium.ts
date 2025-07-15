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
  model: "gemini-2.5-pro",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.4
});

// Bind the schema to the model for structured output
const llmWithStructure = llm.withStructuredOutput(LessonSchema);



export async function* generateLessonsPremium(
  input: LessonInput
): AsyncGenerator<Result<Lesson>, void, unknown> {
  const { content, lessonTitles } = input;
  if (!lessonTitles || lessonTitles.length === 0) {
    yield { err: new Error("lessonTitles array is required"), res: null };
    return;
  }

  const tasks = lessonTitles.map(async (title) => {
    try {
      // Prompt template for single lesson generation
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are an expert educator. Generate a lesson based on the given content and title.\nReturn JSON with:\n- title: string\n- content: string\n- summary: string (optional)\n- objectives: string[] (optional)\n- resources: string[] (optional)"],
        ["human", "Content: {content}\n\nTitle: {title}"]
      ]);
      // Format the prompt for this lesson
      const promptValue = await prompt.invoke({ content, title });
      // Call the model with structured output
      const lesson = await llmWithStructure.invoke(promptValue);
      return { err: null, res: lesson };
    } catch (error) {
      return { err: error, res: null };
    }
  });
  const results = await Promise.all(tasks);
  for (const result of results) {
    yield result;
  }
}
