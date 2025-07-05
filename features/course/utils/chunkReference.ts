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

const zCourseTitle = z.object({
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
  async ({ title, description }: z.infer<typeof zCourseTitle>) => {
    COURSE_METADATA = { title, description };
    
    console.log("\n🎯 Course Metadata Generated");
    console.log("Title:", title);
    console.log("Description:", description);
    
    return "Course title and description generated successfully.";
  },
  {
    name: "generateCourseMetadata",
    description: "Generate a compelling course title and description based on the content.",
    schema: zCourseTitle
  }
);

// === 6. Main function ===
export default async function chunkReferenceAgent(text: string): Promise<{
  title: string;
  description: string;
  lessons: Array<{ title: string; content: string }>;
}> {
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

  const refList = TEXT_CHUNKS.map((_, i) => `Chunk ${i}`).join("\n");

  const messages = [
    new SystemMessage(`You are a professional course planner and content strategist.
Given a list of indexed content chunks, do the following:

1. FIRST: Analyze the content and generate a compelling course title and description using the "generateCourseMetadata" tool.

2. THEN: Plan and create lessons using 1 or more chunk indices.
- Call the "createLessonFromChunks" tool for each lesson.
- Create 3-5 lessons total, depending on the content length.
- Never include raw content. Just use chunk references.
- Make lesson titles engaging and descriptive.

Guidelines:
- Course title should be catchy, professional, and reflect the main topic
- Description should be 1-2 sentences explaining what students will learn
- Lessons should follow a logical progression
- Each lesson should cover a distinct topic or concept`),
    new HumanMessage(`Here are the available content chunks:
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
    
    // Return course metadata and lessons
    const title = COURSE_METADATA ? COURSE_METADATA.title : "Generated Course";
    const description = COURSE_METADATA ? COURSE_METADATA.description : "A comprehensive course based on the provided content.";
    
    return {
      title,
      description,
      lessons: GENERATED_LESSONS
    };
  } catch (error) {
    console.error("Error in chunkReferenceAgent:", error);
    
    // Fallback: create a simple course from the text
    return {
      title: "Introduction Course",
      description: "A comprehensive introduction to the topic.",
      lessons: [{
        title: "Introduction",
        content: text.slice(0, 1000) + (text.length > 1000 ? "..." : "")
      }]
    };
  }
}