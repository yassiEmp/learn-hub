import { createExam } from "@/features/exam/utils/createExam";
import { CleanExam } from "@/features/exam/utils/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // langchain code to generate the exam using ai 
    const exam: CleanExam = await createExam(content);

    // If the dummy exam is returned, respond with the appropriate HTTP response
    if (
      exam.id === "dummy-exam-retry" &&
      exam.title === "Exam Generation Failed - Please Retry"
    ) {
      return new Response(
        JSON.stringify({ error: "Exam generation failed. Please try again." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ exam: exam }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({ error: 'Invalid JSON or server error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}