import { NextRequest } from "next/server";
import { successResponse, errorResponse, serverErrorResponse } from "@/utils/api-helpers";
import { aiClient } from "@/features/course/utils/chunkAI/ai/aiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { topic, source = 'wikipedia' } = body;

        if (!topic) {
            return errorResponse('Topic is required');
        }

        let content = '';
        let title = topic;

        if (source === 'wikipedia') {
            // Try to fetch from Wikipedia API
            try {
                const searchResponse = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
                );

                if (searchResponse.ok) {
                    const data = await searchResponse.json();
                    content = data.extract || '';
                    title = data.title || topic;
                } else {
                    // Fallback to AI generation
                    const { err, res } = await aiClient.generateCourseMetadata(
                        `Generate comprehensive content about ${topic}. Include key concepts, definitions, examples, and practical applications.`
                    );
                    
                    if (err || !res) {
                        throw new Error('Failed to generate content');
                    }
                    
                    content = `# ${topic}\n\n${res.description}\n\nThis topic covers fundamental concepts and practical applications.`;
                    title = res.title || topic;
                }
            } catch (error) {
                console.error('Wikipedia API error:', error);
                // Fallback to AI generation
                const { err, res } = await aiClient.generateCourseMetadata(
                    `Generate comprehensive content about ${topic}. Include key concepts, definitions, examples, and practical applications.`
                );
                
                if (err || !res) {
                    throw new Error('Failed to generate content');
                }
                
                content = `# ${topic}\n\n${res.description}\n\nThis topic covers fundamental concepts and practical applications.`;
                title = res.title || topic;
            }
        } else {
            // AI-generated content
            const { err, res } = await aiClient.generateCourseMetadata(
                `Generate comprehensive educational content about ${topic}. Include:
                - Key concepts and definitions
                - Important examples and use cases
                - Practical applications
                - Common challenges and solutions
                - Best practices and tips
                
                Format as structured educational content suitable for a course.`
            );
            
            if (err || !res) {
                return errorResponse('Failed to generate AI content');
            }
            
            content = `# ${topic}\n\n${res.description}\n\n## Key Concepts\n\nThis topic covers fundamental concepts and practical applications that are essential for understanding the subject matter.\n\n## Learning Objectives\n\nBy studying this topic, you will gain insights into the core principles and real-world applications.\n\n## Practical Applications\n\nThis knowledge can be applied in various contexts to solve problems and make informed decisions.`;
            title = res.title || topic;
        }

        if (!content) {
            return errorResponse('No content could be generated for this topic');
        }

        return successResponse({
            content,
            title,
            source: source === 'wikipedia' ? 'Wikipedia' : 'AI Generated',
            wordCount: content.split(' ').length
        }, 'Topic content generated successfully');

    } catch (error) {
        console.error('Error generating topic content:', error);
        return serverErrorResponse('Failed to generate topic content');
    }
}
