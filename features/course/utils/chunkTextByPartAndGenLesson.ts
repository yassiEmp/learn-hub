import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the lesson schema
const zLesson = z.object({
  title: z.string().describe("The title of the lesson"),
  content: z.string().describe("The full lesson content"),
});

// Simulated lesson creation logic
async function createLesson({ title, content }: { title: string; content: string }) {
  console.log("📘 New Lesson Created:");
  console.log("Title:", title);
  console.log("Content:", content);
  return "Lesson created successfully.";
}

// Wrap lesson creation as a LangChain tool
const createLessonTool = tool(
  async ({ title, content }: { title: string; content: string }) => {
    return await createLesson({ title, content });
  },
  {
    name: "createLesson",
    description: "Use this to create a lesson from a title and its content.",
    schema: zLesson,
  }
);

// Main function with async on-the-fly tool execution
export default async function chunkTextByPartAndGenLesson(text: string) {
  const llm = new ChatGoogleGenerativeAI({
    temperature: 0,
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // Create agent with tool
  const agent = createReactAgent({
    llm,
    tools: [createLessonTool],
  });

  // Create message stream
  const stream = await agent._streamIterator({
    messages: [
      new SystemMessage(
        `You are a professional course splitter. 
You will receive a block of raw text and are expected to:
1. Read and analyze the full text.
2. Generate 1 to 10 appropriate lesson titles.
3. For each title, call the "createLesson" tool with a lesson built from the relevant part of the input.
4. Wait for confirmation before continuing.
5. Do not generate duplicate titles.
Do not summarize — generate real lessons.`
      ),
      new HumanMessage(`Begin immediately.\n\nText: ${text}`),
    ],
  });

  // Step through the stream as the agent processes tool calls
  for await (const step of stream) {
    if (step?.toolCalls?.length) {
      console.log(
        "🛠 Tool call(s):",
        step.toolCalls.map((c: { name: string }) => c.name)
      );
    } else if (step?.output) {
      console.log("✅ Agent finished:", step.output);
    }
  }

  return "All lessons processed.";
}

// const llmWithTools = llm.bindTools([
//   tool(createLesson,{
//       name: "createLesson",
//       schema: zLesson
//   })
// ])
// // chunkTextTemplates is a template that will be used to chunk the text into lessons
// const textChunkPrompt = ChatPromptTemplate.fromMessages([
//     new SystemMessage(chunkTextTemplates),
//     new HumanMessage("here is the text : "+text)
// ])
// const agent = textChunkPrompt.pipe(llmWithTools) ;
// const finalMessage = await agent.invoke("generate the lessons please")
// console.log(finalMessage)
// return finalMessage
// console.log(text,zLesson,textChunkPrompt,llmWithTools.name,finalMessage)