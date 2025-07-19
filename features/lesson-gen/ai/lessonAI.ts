export type Result<T> = { err: null; res: T } | { err: unknown; res: null };
import { aiClient } from '../../../utils/ai/aiClient';

export async function generateLessonTitle(chunkContent: string, lessonNumber: number): Promise<Result<string>> {
  const prompt = {
    system: `You are an expert educator creating lesson titles. Generate engaging, descriptive titles for educational content.\n\nGuidelines:\n- Create titles that clearly indicate what the lesson covers\n- Use action verbs when appropriate\n- Keep titles concise (under 50 characters)\n- Make them engaging and professional\n- Focus on the main concept or skill being taught\n- Avoid generic titles like \"Introduction\" or \"Overview\"\n\nReturn only the title as a string, nothing else.`,
    user: `Generate a lesson title for lesson ${lessonNumber} based on this content:\n\n${chunkContent.substring(0, 1000)}${chunkContent.length > 1000 ? '...' : ''}\n\nCreate a clear, engaging title that captures the main topic of this lesson.`,
    temperature: 0.3
  };
  try {
    const result = await aiClient.sendPrompt<string>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
}

export async function enhanceLessonContent(content: string): Promise<Result<string>> {
  const prompt = {
    system: `You are an expert educational content writer. Your task is to enhance lesson content to improve readability and learning effectiveness.\n\nGuidelines:\n- Improve narrative flow and transitions\n- Add clear explanations where needed\n- Maintain the original meaning and key points\n- Use clear, engaging language\n- Add helpful examples when appropriate\n- Structure content logically\n- Keep the enhanced version concise but comprehensive\n\nReturn the enhanced content as plain text.`,
    user: `Enhance this lesson content to improve readability and learning effectiveness:\n\n${content}\n\nFocus on improving narrative flow, adding clear explanations, and making the content more engaging while preserving all key information.`,
    temperature: 0.2
  };
  try {
    const result = await aiClient.sendPrompt<string>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
}

export async function generateKeyPoints(content: string): Promise<Result<string[]>> {
  const prompt = {
    system: `You are an expert educator extracting key learning points from educational content.\n\nGuidelines:\n- Identify 3-5 main learning points\n- Focus on the most important concepts\n- Use clear, concise language\n- Make points actionable when possible\n- Ensure points are specific to the content\n- Avoid generic statements\n\nReturn your response as a JSON array of strings:\n[\"Key point 1\", \"Key point 2\", \"Key point 3\"]`,
    user: `Extract 3-5 key learning points from this lesson content:\n\n${content}\n\nFocus on the most important concepts and learning outcomes.`,
    temperature: 0.2
  };
  try {
    const result = await aiClient.sendPrompt<string[]>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
}

export async function generateLessonSummary(content: string): Promise<Result<string>> {
  const prompt = {
    system: `You are an expert educator creating lesson summaries. Create concise, informative summaries that capture the main points.\n\nGuidelines:\n- Summarize the key concepts and takeaways\n- Keep summaries concise (2-3 sentences)\n- Focus on what students should remember\n- Use clear, accessible language\n- Highlight the most important information\n\nReturn only the summary text, nothing else.`,
    user: `Create a concise summary of this lesson content:\n\n${content}\n\nFocus on the key concepts and main takeaways that students should remember.`,
    temperature: 0.2
  };
  try {
    const result = await aiClient.sendPrompt<string>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
}

export async function generateLearningObjectives(content: string): Promise<Result<string[]>> {
  const prompt = {
    system: `You are an expert educator creating learning objectives. Generate clear, measurable learning objectives for educational content.\n\nGuidelines:\n- Create 2-4 specific learning objectives\n- Use action verbs (understand, apply, analyze, etc.)\n- Make objectives measurable and specific\n- Focus on what students will be able to do\n- Align with the content being taught\n- Use clear, professional language\n\nReturn your response as a JSON array of strings:\n[\"Objective 1\", \"Objective 2\", \"Objective 3\"]`,
    user: `Generate 2-4 learning objectives for this lesson content:\n\n${content}\n\nFocus on what students will be able to do or understand after completing this lesson.`,
    temperature: 0.3
  };
  try {
    const result = await aiClient.sendPrompt<string[]>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
}

export async function generateLessonTransition(previousLesson: string, currentLesson: string): Promise<Result<string>> {
  const prompt = {
    system: `You are an expert educator creating smooth transitions between lessons. Generate brief, engaging transitions that connect lessons logically.\n\nGuidelines:\n- Create natural connections between topics\n- Keep transitions concise (1-2 sentences)\n- Use engaging language\n- Preview what's coming next\n- Maintain student interest\n- Make logical sense\n\nReturn only the transition text, nothing else.`,
    user: `Create a smooth transition from this previous lesson to the current lesson:\n\nPrevious lesson: ${previousLesson}\nCurrent lesson: ${currentLesson}\n\nGenerate a brief, engaging transition that connects these lessons logically.`,
    temperature: 0.4
  };
  try {
    const result = await aiClient.sendPrompt<string>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
}

export async function generateExercises(content: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<Result<string[]>> {
  const prompt = {
    system: `You are an expert educator creating practice exercises. Generate relevant exercises that help students apply what they've learned.\n\nGuidelines:\n- Create 2-3 practical exercises\n- Match the difficulty level specified\n- Focus on applying key concepts\n- Make exercises engaging and relevant\n- Include different types (questions, tasks, problems)\n- Ensure exercises are clear and actionable\n\nReturn your response as a JSON array of strings:\n[\"Exercise 1\", \"Exercise 2\", \"Exercise 3\"]`,
    user: `Generate 2-3 practice exercises for this lesson content at ${difficulty} difficulty level:\n\n${content}\n\nCreate exercises that help students apply the key concepts from this lesson.`,
    temperature: 0.4
  };
  try {
    const result = await aiClient.sendPrompt<string[]>(prompt);
    if (result.success) return { err: null, res: result.data };
    return { err: result.error, res: null };
  } catch (err) {
    return { err, res: null };
  }
} 