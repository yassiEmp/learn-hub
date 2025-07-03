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

// === 2. Simulated function to fetch chunked content ===
function chunkText(text: string, maxWords = 1000): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
}

// === 3. Store text in memory to simulate retrieval ===
let TEXT_CHUNKS: string[] = [];

// === 4. Tool to create lesson based on chunk references ===
const createLessonFromChunks = tool(
  async ({ title, chunkIndices }: z.infer<typeof zLessonPlan>) => {
    const content = chunkIndices.map(i => TEXT_CHUNKS[i]).join("\n\n");
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

// === 5. Main function ===
export default async function chunkReferenceAgent(text: string) {
  // Pre-chunk the full text
  TEXT_CHUNKS = chunkText(text, 200); // Lower word size for shorter test chunks

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    apiKey: process.env.GOOGLE_API_KEY!,
    temperature: 0,
  });

  const agent = createReactAgent({
    llm,
    tools: [createLessonFromChunks],
  });

  const refList = TEXT_CHUNKS.map((_, i) => `Chunk ${i}`).join("\n");

  const messages = [
    new SystemMessage(`You are a professional course planner.
Given a list of indexed content chunks, do the following:
- Plan a lesson using 1 or more chunk indices.
- Call the \\"createLessonFromChunks\\" tool immediately when a lesson is ready.
- After tool call is complete, plan another lesson.
- Never include raw content. Just use chunk references.
- Do this until no lessons are left to make.`),
    new HumanMessage(`Here are the available content chunks:
${refList}`),
  ];

  const stream = await agent._streamIterator({ messages });

  for await (const step of stream) {
    if (step.toolCalls?.length) {
      console.log("🔧 Tool call:", step.toolCalls.map((t: { name: string }) => t.name).join(", "));
    } else if (step.output) {
      console.log("✅ Final output:", step.output);
    }
  }

  console.log("✅ All lessons generated using references.");
} // END