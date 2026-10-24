import { NextRequest } from "next/server";
import { successResponse, errorResponse, serverErrorResponse, authErrorResponse } from "@/utils/api-helpers";
import { verifyAuth } from "@/utils/auth/server";
import { uploadToBlob, createBlobFile } from "@/utils/blob-helpers";
import { detectMimeType, transcribeMedia } from "@/features/content-import/server/transcribe";

export const maxDuration = 120;

// Gemini inline requests are capped at ~20MB including base64 overhead.
const MAX_MEDIA_BYTES = 15 * 1024 * 1024;

export async function POST(req: NextRequest) {
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const body = await req.json().catch(() => null);
        if (!body || typeof body !== 'object') {
            return errorResponse('The request body must be a valid JSON');
        }
        const { url, type, audio, fileName } = body as {
            url?: unknown; type?: unknown; audio?: unknown; fileName?: string;
        };

        if (type === 'youtube') {
            if (typeof url !== 'string' || !url) return errorResponse('YouTube URL is required');
            return await handleYouTubeVideo(url);
        } else if (type === 'upload') {
            if (typeof audio !== 'string' || !audio) return errorResponse('Video data is required');
            return await handleUploadedVideo(audio, user.id, fileName);
        } else {
            return errorResponse('Invalid video type');
        }
    } catch (error) {
        console.error('Error processing video:', error);
        return serverErrorResponse('Failed to process video');
    }
}

async function handleYouTubeVideo(url: string) {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) return errorResponse('Invalid YouTube URL');

        const { YoutubeTranscript } = await import('youtube-transcript');
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcript || transcript.length === 0) {
            return errorResponse('No transcript available for this YouTube video');
        }

        const content = transcript
            .map(segment => segment.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        return successResponse({
            transcript: content,
            title: `YouTube Video ${videoId}`,
            duration: transcript.length * 10, // rough estimate
            source: url,
            wordCount: content.split(/\s+/).filter(Boolean).length
        }, 'YouTube transcript extracted successfully');
    } catch (error) {
        console.error('YouTube transcript error:', error);
        return errorResponse('Failed to extract YouTube transcript. The video may not have captions available.');
    }
}

async function handleUploadedVideo(media: string, userId: string, fileName?: string) {
    const bytes = Buffer.from(media, 'base64');
    if (bytes.length > MAX_MEDIA_BYTES) {
        return errorResponse('Video is too large to transcribe (15MB limit)');
    }

    const mimeType = detectMimeType(bytes, fileName, 'video');
    const name = fileName || 'video.webm';

    let blobResult: Awaited<ReturnType<typeof uploadToBlob>> | null = null;
    try {
        blobResult = await uploadToBlob(new File([bytes], name, { type: mimeType }), name, {
            userId,
            isPublic: false,
            contentType: mimeType,
        });
    } catch (uploadErr) {
        console.error('Video blob upload failed:', uploadErr);
    }

    const { err, res: transcript } = await transcribeMedia(bytes, mimeType);
    if (err || !transcript) {
        return errorResponse('Could not transcribe this video. Make sure it contains clear speech and try again.', 502);
    }

    return successResponse({
        transcript,
        title: fileName?.replace(/\.[^/.]+$/, "") || 'Uploaded Video',
        duration: 0,
        source: fileName || 'uploaded_video',
        wordCount: transcript.split(/\s+/).filter(Boolean).length,
        blobUrl: blobResult?.url,
        blobPathname: blobResult?.pathname,
        blobFile: blobResult ? createBlobFile(blobResult, name, bytes.length, 'audio') : undefined,
    }, 'Video transcription completed successfully');
}

function extractVideoId(url: string): string | null {
    if (/^[\w-]{11}$/.test(url)) return url;
    const match = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
}
