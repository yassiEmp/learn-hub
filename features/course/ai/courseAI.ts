import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { jsonrepair as parseJSON } from 'jsonrepair';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const courseMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string())
});

type CourseMetadata = z.infer<typeof courseMetadataSchema>;

const parser = StructuredOutputParser.fromZodSchema(courseMetadataSchema);
const formatInstructions = parser.getFormatInstructions().replace(/\{/g, '{{').replace(/\}/g, '}}');
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a metadata-extraction assistant."],
  ["human", `\nExtract structured metadata from the following course description. \nReturn **only** a valid JSON object with these fields (no explanations, no markdown):\n\n${formatInstructions}\n\nExample:\nInput:\n\"Master React from scratch. This course covers JSX, components, hooks, and React Router. Perfect for beginners.\"\nOutput:\n{{{{\n  \"title\": \"React for Beginners\",\n  \"description\": \"Learn React from the ground up including JSX, components, hooks, and routing.\",\n  \"category\": \"Web Development\",\n  \"level\": \"beginner\",\n  \"tags\": [\"React\", \"Frontend\", \"JSX\", \"Hooks\", \"Routing\"]\n}}}}\n\nNow process this input:\n{input}\n`]
]);

const chain = prompt.pipe(new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.2,
  maxOutputTokens: 10000
})).pipe(parser);

export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function extractMetadata(courseText: string): Promise<Result<CourseMetadata>> {
  let rawOutput: unknown = null;
  try {
    rawOutput = await chain.invoke({ input: courseText });
    return { err: null, res: courseMetadataSchema.parse(rawOutput) };
  } catch (err) {
    if (rawOutput) {
      try {
        const modelOnlyChain = prompt.pipe(new ChatGoogleGenerativeAI({
          model: "gemini-2.0-flash",
          temperature: 0.2,
          maxOutputTokens: 10000
        }));
        const rawOutputChunk = await modelOnlyChain.invoke({ input: courseText });
        const rawOutputText = (rawOutputChunk as { content: string }).content;
        const repaired = parseJSON(rawOutputText);
        return { err: null, res: courseMetadataSchema.parse(repaired) };
      } catch (repairErr) {
        return { err: repairErr, res: null };
      }
    }
    return { err, res: null };
  }
}

export type { CourseMetadata }; 