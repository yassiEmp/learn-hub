// ============================================================================
// Enhanced Course Generation System
// ============================================================================

import { enhancedChunkAI } from "@/features/course/utils/chunkAI"; // adjust path as needed

export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

type Lesson = {
  title: string;
  content: string;
  duration: string;
  videoUrl: string;
  isCompleted: boolean;
  isCurrent: boolean;
};

// Add a type for enhancedChunkAI lesson if not imported
interface EnhancedChunkLesson {
  title: string;
  content: string;
  duration: string;
}

type CourseResult = {
  title: string;
  description: string;
  lessons: Lesson[];
};

// Helper function to generate a title from content (fallback)
async function generateTitleFromContent(content: string): Promise<{ title: string; description: string }> {
  try {
    // Simple title generation based on content analysis
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']);
    
    const significantWords = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);
    
    const title = significantWords.length > 0 
      ? significantWords.join(' ').replace(/\b\w/g, l => l.toUpperCase())
      : 'Comprehensive Course';
    
    const description = `Learn about ${significantWords.slice(0, 3).join(', ')} through this comprehensive course.`;
    
    return { title, description };
  } catch {
    return {
      title: 'Generated Course',
      description: 'A comprehensive course based on the provided content.'
    };
  }
}

export default async function generateCourseAndLessons(
  text: string,
  style: "markdown" | "aiGen" | "chunk"
): Promise<Result<CourseResult>> {
  switch (style) {
    case "aiGen": {
      const aiGenMetadata = await generateTitleFromContent(text);
      return {
        err: null,
        res: {
          title: aiGenMetadata.title,
          description: aiGenMetadata.description,
          lessons: [{
            title: "AI Generated Course",
            content: text,
            duration: "30 min",
            videoUrl: "",
            isCompleted: false,
            isCurrent: false
          }]
        }
      };
    }
    case "markdown": {
      const markdownLessons: Lesson[] = text.split(/#{1,6}\s+/).filter(Boolean).map((section: string, index: number): Lesson => {
        const lines = section.trim().split('\n');
        const title = lines[0] || `Lesson ${index + 1}`;
        const content = lines.slice(1).join('\n').trim();
        return {
          title: title.length > 50 ? title.substring(0, 50) + "..." : title,
          content: content || section,
          duration: "15 min",
          videoUrl: "",
          isCompleted: false,
          isCurrent: false
        };
      });
      const markdownMetadata = await generateTitleFromContent(text);
      return {
        err: null,
        res: {
          title: markdownMetadata.title,
          description: markdownMetadata.description,
          lessons: markdownLessons.length > 0 ? markdownLessons : [{
            title: "Introduction",
            content: text,
            duration: "20 min",
            videoUrl: "",
            isCompleted: false,
            isCurrent: false
          }]
        }
      };
    }
    case "chunk": {
      try {
        console.log('🚀 Using Enhanced Chunk AI for course generation...');
        const result = await enhancedChunkAI.processText(text);
        if (result.err || !result.res) {
          console.warn('Enhanced Chunk AI failed, falling back to basic generation:', result.err);
          const fallbackMetadata = await generateTitleFromContent(text);
          return {
            err: null,
            res: {
              title: fallbackMetadata.title,
              description: fallbackMetadata.description,
              lessons: [{
                title: "Introduction",
                content: text,
                duration: "25 min",
                videoUrl: "",
                isCompleted: false,
                isCurrent: false
              }]
            }
          };
        }
        console.log(`✅ Enhanced Chunk AI generated ${result.res.course.lessons.length} lessons`);
        return {
          err: null,
          res: {
            title: result.res.course.title,
            description: result.res.course.description,
            lessons: result.res.course.lessons.map((lesson: EnhancedChunkLesson, index: number): Lesson => ({
              title: lesson.title,
              content: lesson.content,
              duration: lesson.duration,
              videoUrl: "",
              isCompleted: false,
              isCurrent: index === 0
            }))
          }
        };
      } catch (error) {
        console.error('Enhanced Chunk AI error:', error);
        // Fallback to basic generation
        return {
          err: error,
          res: null
        };
      }
    }
    default: {
      const fallbackMetadata = await generateTitleFromContent(text);
      return {
        err: null,
        res: {
          title: fallbackMetadata.title,
          description: fallbackMetadata.description,
          lessons: [{
            title: "Introduction",
            content: text,
            duration: "25 min",
            videoUrl: "",
            isCompleted: false,
            isCurrent: false
          }]
        }
      };
    }
  }
}