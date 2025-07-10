import { aiClient } from "@/features/course/utils/chunkAI/ai/aiClient";
import { supabase } from "@/lib/supabase";

interface CreateCourseOptions {
  text: string;
  userId: string;
  category?: string;
  level?: string;
  price?: number;
  tags?: string[];
}

export async function createCourse({
  text,
  userId,
  price = 0,
}: CreateCourseOptions): Promise<{ error: null; id: string } | { error: string; id: null }> {
  // 1. Generate course metadata using AI
  const metadata = await aiClient.generateCourseMetadata(text);
  const { title, description, category, level, tags } = metadata;

  // 2. Insert course into the database
  const { data: course, error } = await supabase
    .from("courses")
    .insert([
      {
        title,
        description,
        content: text,
        owner_id: userId,
        category,
        level,
        price,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return { error: null, id: course.id };
}

// Simple test runner for manual testing
if (require.main === module) {
  (async () => {
    try {
      const result = await createCourse({
        text: "Learn the basics of TypeScript, including types, interfaces, and generics. Perfect for beginners!",
        userId: "test-user-id",
        price: 0
      });
      console.log("createCourse result:", result);
    } catch (err) {
      console.error("createCourse error:", err);
    }
  })();
} 