// Required imports
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// === 1. Zod schema for tool call ===
const zLessonPlan = z.object({
  title: z.string().describe("The lesson title"),
  chunkIndices: z.array(z.number()).describe("List of indices pointing to chunks to use for this lesson")
});

const zCourse = z.object({
  title: z.string().describe("A compelling course title based on the content"),
  description: z.string().describe("A brief description of the course")
});

// === 2. Function to chunk text ===
function chunkText(text: string, maxWords = 200): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
}

// === 3. Store text in memory ===
let TEXT_CHUNKS: string[] = [];
let GENERATED_LESSONS: Array<{ title: string; content: string }> = [];
let COURSE_METADATA: { title: string; description: string } | null = null;

// === 4. Tool to create lesson based on chunk references ===
const createLessonFromChunks = tool(
  async ({ title, chunkIndices }: z.infer<typeof zLessonPlan>) => {
    const content = chunkIndices.map(i => TEXT_CHUNKS[i]).join("\n\n");
    
    // Store the lesson
    GENERATED_LESSONS.push({ title, content });
    
    console.log("\n📘 Lesson Created\nTitle:", title);
    console.log("Chunks:", chunkIndices.join(", "));
    console.log("Content Preview:", content.slice(0, 150), "...\n");
    
    return "Lesson created using referenced chunks.";
  },
  {
    name: "createLessonFromChunks",
    description: "Create a lesson using a title and a list of referenced chunk indices.",
    schema: zLessonPlan
  }
);

// === 5. Tool to generate course title and description ===
const generateCourseMetadata = tool(
  async ({ title, description }: z.infer<typeof zCourse>) => {
    COURSE_METADATA = { title, description };
    
    console.log("\n🎯 Course Metadata Generated");
    console.log("Title:", title);
    console.log("Description:", description);
    
    return "Course title and description generated successfully.";
  },
  {
    name: "generateCourseMetadata",
    description: "Generate a compelling course title and description based on the content.",
    schema: zCourse
  }
);

export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

// === 6. Main function ===
export default async function chunkReferenceAgent(text: string): Promise<Result<{
  title: string;
  description: string;
  lessons: Array<{ title: string; content: string }>;
}>> {
  // Reset state
  TEXT_CHUNKS = [];
  GENERATED_LESSONS = [];
  COURSE_METADATA = null;
  
  // Pre-chunk the full text
  TEXT_CHUNKS = chunkText(text, 200);

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    apiKey: process.env.GOOGLE_API_KEY!,
    temperature: 0,
  });

  const agent = createReactAgent({
    llm,
    tools: [createLessonFromChunks, generateCourseMetadata],
  });

  const refList = TEXT_CHUNKS.map((chunk, i) => `Chunk ${i}: ${chunk.slice(0, 100)}...`).join("\n");

  const messages = [
    new SystemMessage(`You are a professional course planner and content strategist.
Given a list of indexed content chunks, you MUST follow these steps in order:

1. FIRST: Analyze the content chunks and generate a compelling course title and description using the "generateCourseMetadata" tool.
   - Look at the content previews to understand the topic
   - Create a catchy, professional title that reflects the main subject
   - Write a 1-2 sentence description explaining what students will learn

2. THEN: Plan and create lessons using 1 or more chunk indices.
   - Call the "createLessonFromChunks" tool for each lesson
   - Create 3-5 lessons total, depending on the content length
   - Never include raw content. Just use chunk references
   - Make lesson titles engaging and descriptive

IMPORTANT: You MUST call generateCourseMetadata FIRST before creating any lessons.
The course title and description are essential for the course structure.`),
    new HumanMessage(`Here are the available content chunks with previews:
${refList}`),
  ];

  try {
    const stream = await agent._streamIterator({ messages });

    for await (const step of stream) {
      if (step.toolCalls?.length) {
        console.log("🔧 Tool call:", step.toolCalls.map((t: { name: string }) => t.name).join(", "));
      } else if (step.output) {
        console.log("✅ Final output:", step.output);
      }
    }

    console.log("✅ All lessons generated using references.");
    console.log("📊 Final Results:");
    console.log("- Course Metadata:", COURSE_METADATA);
    console.log("- Lessons Count:", GENERATED_LESSONS.length);
    
    // Return course metadata and lessons with explicit type handling
    let finalTitle = "Generated Course";
    let finalDescription = "A comprehensive course based on the provided content.";
    
    if (COURSE_METADATA) {
      const metadata = COURSE_METADATA as { title: string; description: string };
      finalTitle = metadata.title;
      finalDescription = metadata.description;
    }
    
    console.log("🎯 Final Course Title:", finalTitle);
    console.log("📝 Final Course Description:", finalDescription);
    
    return {
      err: null,
      res: {
        title: finalTitle,
        description: finalDescription,
        lessons: GENERATED_LESSONS
      }
    };
  } catch (error) {
    console.error("Error in chunkReferenceAgent:", error);
    
    // Fallback: create a simple course from the text
    return {
      err: error,
      res: null
    };
  }
}