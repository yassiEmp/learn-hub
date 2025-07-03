import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {  HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";

// === 1. Define Zod schema for tool input ===
const zLesson = z.object({
  title: z.string().describe("The title of the lesson"),
  content: z.string().describe("The full lesson content"),
});

// === 2. Define the lesson creation tool ===
const createLessonTool = tool(
  async ({ title , content }: z.infer<typeof zLesson>) => {
    const now = new Date().toISOString();
    console.log("📘 Lesson created at:", now, "| Title:", title, "\n\n Content:", content);
    return "Lesson created successfully.";
  },
  {
    name: "createLesson",
    description: "Create a lesson from a title and its content",
    schema: zLesson,
  }
);

// === 3. Main agent loop ===
export async function chunkTextRealtime(text: string) {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0,
  });

  const tools = [createLessonTool];
  const messages = [
    new SystemMessage(`You are a lesson generator.
You must:
1. Read the provided text.
2. Identify one lesson at a time.
3. As soon as you are ready, call the "createLesson" tool.
4. After the tool returns a result, continue with the next lesson.
Never plan multiple lessons at once.
`),
    new HumanMessage(`Here is the course text:\n\n${text}`),
  ];

  while (true) {
    const response = await llm.invoke(messages, { tools });

    messages.push(response);

    // Handle tool calls if any
    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const call of response.tool_calls) {
        const tool = tools.find(t => t.name === call.name);
        if (!tool) continue;

        const result = await tool.func(call.args as z.infer<typeof zLesson>);

        messages.push(
          new ToolMessage({
            tool_call_id: call.id || "1",
            content: result,
          })
        );
      }
    } else {
      // No more tool calls = agent is done
      if (response.content) {
        console.log("✅ Agent output:", response.content);
      }
      break;
    }
  }

  return "✅ All lessons processed.";
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