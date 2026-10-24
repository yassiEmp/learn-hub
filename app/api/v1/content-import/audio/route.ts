import { NextRequest } from "next/server";
import { successResponse, errorResponse, serverErrorResponse, authErrorResponse } from "@/utils/api-helpers";
import { verifyAuth } from "@/utils/auth/server";
import { uploadToBlob, createBlobFile } from "@/utils/blob-helpers";
import { detectMimeType, transcribeMedia } from "@/features/content-import/server/transcribe";

export const maxDuration = 120;

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

const formatDuration = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

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
        const { audio, duration, fileName, fileSize } = body as {
            audio?: unknown; duration?: number; fileName?: string; fileSize?: number;
        };

        if (typeof audio !== 'string' || !audio) {
            return errorResponse('Audio data is required');
        }

        const audioBuffer = Buffer.from(audio, 'base64');
        if ((fileSize && fileSize > MAX_AUDIO_BYTES) || audioBuffer.length > MAX_AUDIO_BYTES) {
            return errorResponse('Audio file size exceeds 10MB limit');
        }
        if (duration && duration > 600) {
            return errorResponse('Audio duration exceeds 10 minutes limit');
        }

        const name = fileName || 'audio.webm';
        const mimeType = detectMimeType(audioBuffer, fileName, 'audio');

        // Upload is best-effort: a missing blob store must not block transcription.
        let blobResult: Awaited<ReturnType<typeof uploadToBlob>> | null = null;
        try {
            blobResult = await uploadToBlob(new File([audioBuffer], name, { type: mimeType }), name, {
                userId: user.id,
                isPublic: false,
                contentType: mimeType,
            });
        } catch (uploadErr) {
            console.error('Audio blob upload failed:', uploadErr);
        }

        const { err, res: transcript } = await transcribeMedia(audioBuffer, mimeType);
        if (err || !transcript) {
            return errorResponse('Could not transcribe this audio. Make sure it contains clear speech and try again.', 502);
        }

        const title = fileName?.replace(/\.[^/.]+$/, "") ||
            `Audio Recording (${duration ? formatDuration(duration) : 'Unknown'})`;

        return successResponse({
            transcript,
            title,
            duration: duration || 0,
            source: fileName || 'audio_recording',
            wordCount: transcript.split(/\s+/).filter(Boolean).length,
            blobUrl: blobResult?.url,
            blobPathname: blobResult?.pathname,
            blobFile: blobResult ? createBlobFile(blobResult, name, fileSize || audioBuffer.length, 'audio') : undefined,
        }, 'Audio transcription completed successfully');
    } catch (error) {
        console.error('Error processing audio:', error);
        return serverErrorResponse('Failed to process audio');
    }
}
