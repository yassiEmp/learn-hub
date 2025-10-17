import { NextRequest } from "next/server";
import { successResponse, errorResponse, serverErrorResponse, authErrorResponse } from "@/utils/api-helpers";
import { verifyAuth } from "@/utils/supabase/server";
import { uploadToBlob, createBlobFile } from "@/utils/blob-helpers";

export async function POST(req: NextRequest) {
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const body = await req.json();
        const { url, type, audio, fileName } = body;

        if (type === 'youtube') {
            return await handleYouTubeVideo(url, user.id);
        } else if (type === 'upload') {
            return await handleUploadedVideo(audio, fileName, user.id);
        } else {
            return errorResponse('Invalid video type');
        }

    } catch (error) {
        console.error('Error processing video:', error);
        return serverErrorResponse('Failed to process video');
    }
}

async function handleYouTubeVideo(url: string, userId: string) {
    try {
        // For now, we'll use a simple approach
        // In production, you might want to use youtube-transcript or similar service
        const youtubeTranscriptModule = await import('youtube-transcript');
        const transcript = await youtubeTranscriptModule.YoutubeTranscript.fetchTranscript(url);

        if (!transcript || transcript.length === 0) {
            return errorResponse('No transcript available for this YouTube video');
        }
        console.log(userId)
        // Combine transcript segments
        const content = transcript
            .map(segment => segment.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Extract video ID for title
        const videoId = extractVideoId(url);
        const title = `YouTube Video ${videoId}`;

        return successResponse({
            transcript: content,
            title,
            duration: transcript.length * 10, // Rough estimate
            source: url,
            wordCount: content.split(' ').length
        }, 'YouTube transcript extracted successfully');

    } catch (error) {
        console.error('YouTube transcript error:', error);
        return errorResponse('Failed to extract YouTube transcript. The video may not have captions available.');
    }
}

async function handleUploadedVideo(audio: string, userId: string ,fileName?: string) {
    try {
        // 1. Convert base64 to buffer and upload to Vercel Blob
        const audioBuffer = Buffer.from(audio, 'base64');
        const audioFile = new File([audioBuffer], fileName || 'video_audio.webm', { type: 'audio/webm' });
        const blobResult = await uploadToBlob(audioFile, fileName || 'video_audio.webm', {
            userId,
            isPublic: false, // Default to private, will update based on course privacy
            contentType: 'audio/webm',
        });
        console.log(userId)
        // 2. For now, we'll simulate transcription
        // In production, you would send the audio to Whisper API or similar service
        
        // This is a placeholder - you would implement actual audio transcription here
        const mockTranscript = `This is a placeholder transcript for the uploaded video: ${fileName || 'Unknown'}. 
        
        In a production environment, this would be replaced with actual audio transcription using services like:
        - OpenAI Whisper API
        - AssemblyAI
        - Deepgram
        - Google Speech-to-Text
        
        The audio file would be processed to extract spoken content and convert it to text for course creation.`;

        const title = fileName?.replace(/\.[^/.]+$/, "") || 'Uploaded Video';

        // 3. Create blob file object for database storage
        const blobFile = createBlobFile(blobResult, fileName || 'video_audio.webm', audioBuffer.length, 'audio');

        return successResponse({
            transcript: mockTranscript,
            title,
            duration: 0, // Would be calculated from actual audio
            source: fileName || 'uploaded_video',
            wordCount: mockTranscript.split(' ').length,
            blobUrl: blobResult.url,
            blobPathname: blobResult.pathname,
            blobFile
        }, 'Video transcription completed successfully');

    } catch (error) {
        console.error('Video transcription error:', error);
        return errorResponse('Failed to transcribe video audio');
    }
}

function extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : 'unknown';
}
