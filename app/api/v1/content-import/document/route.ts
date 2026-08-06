import { NextRequest } from "next/server";
import { successResponse, errorResponse, serverErrorResponse, authErrorResponse } from "@/utils/api-helpers";
import { quotaManager } from "@/features/content-import/utils/quotas";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { verifyAuth } from "@/utils/supabase/server";
import { uploadToBlob, createBlobFile } from "@/utils/blob-helpers";

export async function POST(req: NextRequest) {
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        // 2. Handle FormData request (Uppy sends FormData)
        const formData = await req.formData();
        const file = formData.get('document') as File;
        
        if (!file) {
            return errorResponse('File is required');
        }

        const fileName = file.name;
        const fileType = file.type;
        const fileSize = file.size;

        // 3. Check quota
        const quotaCheck = quotaManager.checkQuota('document', fileSize);
        if (!quotaCheck.allowed) {
            return errorResponse(quotaCheck.reason || 'Quota exceeded');
        }

        // 4. Upload to Vercel Blob (private by default, will update when course is created)
        const blobResult = await uploadToBlob(file, fileName, {
            userId: user.id,
            isPublic: false, // Default to private, will update based on course privacy
            contentType: fileType,
        });

        // 5. Process document with AI
        const llm = new ChatGoogleGenerativeAI({
            model: process.env.MODEL!,
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.2,
            maxOutputTokens: 4000,
        });

        // Create a prompt for document processing
        const prompt = `Please analyze this document and extract the main educational content. 
        Focus on:
        - Key concepts and topics
        - Important definitions and explanations
        - Examples and case studies
        - Practical applications
        - Learning objectives
        
        Format the content as structured educational material suitable for creating a course.
        If the document contains images, charts, or diagrams, describe them in context.
        
        Document: ${fileName} (${fileType})`;

        try {
            // Gemini takes inline binary as base64. The langchain converter only
            // understands the "media" part type; "file" throws "Unknown content type".
            const arrayBuffer = await file.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString('base64');

            const response = await llm.invoke([
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "media", mimeType: fileType, data: base64Data }
                    ]
                }
            ]);

            const content = typeof response.content === 'string'
                ? response.content
                : JSON.stringify(response.content);

            if (!content?.trim()) {
                return errorResponse('Failed to process document content');
            }

            // Extract title from filename or content
            const title = fileName?.replace(/\.[^/.]+$/, "") || 'Document Content';

            // Record usage
            quotaManager.recordUsage('document');

            // 6. Create blob file object for database storage
            const blobFile = createBlobFile(blobResult, fileName, fileSize, 'document');

            return successResponse({
                content,
                title,
                fileType,
                fileSize,
                wordCount: content.split(' ').length,
                blobUrl: blobResult.url,
                blobPathname: blobResult.pathname,
                blobFile // Include the full blob file object for easy storage
            }, 'Document processed successfully');

        } catch (aiError) {
            console.error('AI processing error:', aiError);

            // Returning placeholder text as a success made a failed extraction
            // indistinguishable from a working one, and courses were then built
            // from the placeholder. Report the failure instead.
            return errorResponse(
                'Could not extract content from this document. Please try another file.',
                502
            );
        }

    } catch (error) {
        console.error('Error processing document:', error);
        return serverErrorResponse('Failed to process document');
    }
}
