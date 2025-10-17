"use client"
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Video, Youtube, Loader2, Upload, Play, Pause, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImportResult } from '../utils/types';
import { useAuth } from '@/hooks/useAuth';

interface VideoImportProps {
  onContentImport: (result: ImportResult) => void;
  onProcessingChange: (processing: boolean) => void;
}

interface VideoFile {
  file: File;
  audioBlob?: Blob;
  isExtracting: boolean;
  isTranscribing: boolean;
}

export const VideoImport: React.FC<VideoImportProps> = ({ onContentImport, onProcessingChange }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
    const { user } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleYouTubeExtract = useCallback(async () => {
    if (!youtubeUrl.trim() || !validateYouTubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);
    setProgress("Extracting transcript from YouTube...");

    try {
      const response = await fetch('/api/v1/content-import/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: youtubeUrl,
          type: 'youtube'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract YouTube transcript');
      }

      const data = await response.json();

      const result: ImportResult = {
        type: 'video',
        content: data.transcript,
        blobUrl: data.blobUrl,
        blobPathname: data.blobPathname,
        metadata: {
          source: youtubeUrl,
          title: data.title || 'YouTube Video',
          duration: data.duration,
          fileType: 'youtube'
        }
      };

      onContentImport(result);
    } catch (error) {
      console.error('Error extracting YouTube content:', error);
      setError(error instanceof Error ? error.message : 'Failed to extract content');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
      setProgress("");
    }
  }, [youtubeUrl, onContentImport, onProcessingChange]);

  const extractAudioFromVideo = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');

      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Create MediaRecorder to capture audio
        const stream = canvas.captureStream();
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          resolve(audioBlob);
        };

        mediaRecorder.start();
        video.play();

        video.onended = () => {
          mediaRecorder.stop();
          URL.revokeObjectURL(video.src);
        };
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
        URL.revokeObjectURL(video.src);
      };
    });
  };

  const handleVideoFileSelect = useCallback(async (file: File) => {
    setVideoFile({
      file,
      isExtracting: true,
      isTranscribing: false
    });

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);
    setProgress("Extracting audio from video...");

    try {
      // Extract audio from video
      const audioBlob = await extractAudioFromVideo(file);

      setVideoFile(prev => prev ? { ...prev, audioBlob, isExtracting: false, isTranscribing: true } : null);
      setProgress("Transcribing audio...");

      // Convert audio to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Send to API for transcription
      const response = await fetch('/api/v1/content-import/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64,
          fileName: file.name,
          type: 'upload'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe video');
      }

      const data = await response.json();

      const result: ImportResult = {
        type: 'video',
        content: data.transcript,
        blobUrl: data.blobUrl,
        blobPathname: data.blobPathname,
        metadata: {
          source: file.name,
          title: data.title || file.name,
          duration: data.duration,
          fileType: 'video',
          fileSize: file.size
        }
      };

      onContentImport(result);
      setVideoFile(prev => prev ? { ...prev, isTranscribing: false } : null);
    } catch (error) {
      console.error('Error processing video:', error);
      setError(error instanceof Error ? error.message : 'Failed to process video');
      setVideoFile(null);
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
      setProgress("");
    }
  }, [onContentImport, onProcessingChange]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoFileSelect(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleYouTubeExtract();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Import Video Content</h3>
        <p className="text-sm text-muted-foreground">
          Extract content from YouTube videos or upload your own videos
        </p>
      </div>

      {/* YouTube Section */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleYouTubeExtract}
            disabled={isProcessing}
            className={cn(
              "px-6",
              "bg-primary hover:bg-primary/90"
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Youtube className="w-4 h-4 mr-2" />
                Extract
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            "border-border hover:border-primary/50"
          )}
        >
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">
            Upload Video File
          </p>
          <div className="flex justify-center items-center">
            <p className="text-sm w-fit text-muted-foreground mb-4 p-1 bg-muted/50 border border-border/30 rounded-lg">
              Supports MP4, AVI, MOV, WebM (max 100MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className={cn(
              "inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Choose Video
          </label>
        </div>

        {videoFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/20 border border-border/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {videoFile.isExtracting || videoFile.isTranscribing ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : (
                <Video className="w-5 h-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{videoFile.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {videoFile.isExtracting && "Extracting audio..."}
                  {videoFile.isTranscribing && "Transcribing..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress and Error Messages */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm"
        >
          {progress}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};
