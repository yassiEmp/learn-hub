"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Mic, MicOff, Upload, Loader2, Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImportResult } from '../utils/types';
// Auth is handled by the protected layout

interface AudioImportProps {
  onContentImport: (result: ImportResult) => void;
  onProcessingChange: (processing: boolean) => void;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

export const AudioImport: React.FC<AudioImportProps> = ({ onContentImport, onProcessingChange }) => {
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
    // Auth is handled by the protected layout

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecording(prev => ({ ...prev, audioBlob }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Start timer
      timerRef.current = setInterval(() => {
        setRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Microphone access denied. Please allow microphone access and try again.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(prev => ({ ...prev, isRecording: false }));

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recording.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording.isRecording) {
      if (recording.isPaused) {
        mediaRecorderRef.current.resume();
        setRecording(prev => ({ ...prev, isPaused: false }));
      } else {
        mediaRecorderRef.current.pause();
        setRecording(prev => ({ ...prev, isPaused: true }));
      }
    }
  }, [recording.isRecording, recording.isPaused]);

  const playRecording = useCallback(() => {
    if (recording.audioBlob) {
      const audioUrl = URL.createObjectURL(recording.audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
    }
  }, [recording.audioBlob]);


  const clearRecording = useCallback(() => {
    setRecording({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null
    });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const transcribeAudio = useCallback(async () => {
    if (!recording.audioBlob) return;

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);
    setProgress("Transcribing audio...");

    try {
      // Convert audio to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(recording.audioBlob!);
      });

      // Send to API for transcription
      const response = await fetch('/api/v1/content-import/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64,
          duration: recording.duration
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();

      const result: ImportResult = {
        type: 'audio',
        content: data.transcript,
        blobUrl: data.blobUrl,
        blobPathname: data.blobPathname,
        metadata: {
          source: 'audio_recording',
          title: `Audio Recording (${formatTime(recording.duration)})`,
          duration: recording.duration,
          fileType: 'audio'
        }
      };

      onContentImport(result);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setError(error instanceof Error ? error.message : 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
      setProgress("");
    }
  }, [recording.audioBlob, recording.duration, onContentImport, onProcessingChange]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);
    setProgress("Transcribing audio file...");

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Send to API for transcription
      const response = await fetch('/api/v1/content-import/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64,
          fileName: file.name,
          fileSize: file.size
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio file');
      }

      const data = await response.json();

      const result: ImportResult = {
        type: 'audio',
        content: data.transcript,
        blobUrl: data.blobUrl,
        blobPathname: data.blobPathname,
        metadata: {
          source: file.name,
          title: data.title || file.name,
          duration: data.duration,
          fileType: 'audio',
          fileSize: file.size
        }
      };

      onContentImport(result);
    } catch (error) {
      console.error('Error transcribing audio file:', error);
      setError(error instanceof Error ? error.message : 'Failed to transcribe audio file');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
      setProgress("");
    }
  }, [onContentImport, onProcessingChange]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Record or Upload Audio</h3>
        <p className="text-sm text-muted-foreground">
          Record audio directly or upload audio files for transcription
        </p>
      </div>

      {/* Recording Section */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-mono text-foreground mb-4">
            {formatTime(recording.duration)}
          </div>

          <div className="flex justify-center gap-3">
            {!recording.isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing}
                className={cn(
                  "text-white",
                  "bg-red-500 hover:bg-red-600"
                )}
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                >
                  {recording.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {recording.isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        {recording.audioBlob && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/20 border border-border/30 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MicOff className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Recording Complete ({formatTime(recording.duration)})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ready for transcription
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={playRecording}
                  variant="outline"
                  size="sm"
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  onClick={transcribeAudio}
                  disabled={isProcessing}
                  size="sm"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Transcribe'
                  )}
                </Button>
                <Button
                  onClick={clearRecording}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
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
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">
            Upload Audio File
          </p>
          <div className="flex justify-center items-center">
            <p className="text-sm w-fit text-muted-foreground mb-4 p-1 bg-muted/50 border border-border/30 rounded-lg">
              Supports MP3, WAV, M4A, OGG (max 10MB)
            </p>
          </div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className={cn(
              "inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Choose Audio File
          </label>
        </div>
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
