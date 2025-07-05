import chunkReferenceAgent from "./chunkReference"

// Helper function to generate a title from content
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

export default async function generateLessons(text: string, style: "markdown" | "aiGen" | "chunk"): Promise<{
  title: string;
  description: string;
  lessons: Array<{
    title: string;
    content: string;
    duration: string;
    videoUrl: string;
    isCompleted: boolean;
    isCurrent: boolean;
  }>;
}> {
  switch (style) {
    case "aiGen":
      // For AI generated style, create a single comprehensive lesson
      const aiGenMetadata = await generateTitleFromContent(text);
      return {
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
      };
      
    case "markdown":
      // For markdown style, split by headers and create lessons
      const markdownLessons = text.split(/#{1,6}\s+/).filter(Boolean).map((section, index) => {
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
      };
      
    case "chunk":
      // Use the chunk reference agent for advanced lesson generation
      const chunkResult = await chunkReferenceAgent(text);
      return {
        title: chunkResult.title,
        description: chunkResult.description,
        lessons: chunkResult.lessons.map((lesson, index) => ({
          title: lesson.title,
          content: lesson.content,
          duration: "20 min",
          videoUrl: "",
          isCompleted: false,
          isCurrent: index === 0 // First lesson is current
        }))
      };
      
    default:
      // Fallback for unknown styles
      const fallbackMetadata = await generateTitleFromContent(text);
      return {
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
      };
  }
}