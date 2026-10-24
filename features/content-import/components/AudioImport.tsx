"use client"
import React, { useState } from 'react';
import { FieldError, FileDrop, SubmitButton } from './SourceFormParts';
import { BlobUpload, SourceFormProps, toSourceFiles } from './sourceTypes';
import { fileToBase64, postImport } from '../utils/importClient';

const MAX_BYTES = 10 * 1024 * 1024;

interface TranscriptResponse extends BlobUpload {
  transcript: string;
  title?: string;
}

/** Audio or video file upload → transcript → course. */
export const AudioImport: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File | null) => {
    setError(null);
    if (f && !f.type.startsWith('audio/') && !f.type.startsWith('video/')) {
      setError('Please choose an audio or video file (MP3, WAV, M4A, MP4, MOV, WebM…).');
      return;
    }
    if (f && f.size > MAX_BYTES) {
      setError('This file is larger than 10 MB. Trim it or upload a shorter clip.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Choose an audio or video file to continue.');
      return;
    }
    const selected = file;
    const isVideo = selected.type.startsWith('video/');
    onSubmit({
      sourceType: isVideo ? 'video' : 'audio',
      prepare: async () => {
        const base64 = await fileToBase64(selected);
        const data = isVideo
          ? await postImport<TranscriptResponse>('video', {
              audio: base64,
              fileName: selected.name,
              type: 'upload',
            })
          : await postImport<TranscriptResponse>('audio', {
              audio: base64,
              fileName: selected.name,
              fileSize: selected.size,
            });
        return {
          text: data.transcript,
          sourceType: isVideo ? 'video' : 'audio',
          sourceFiles: toSourceFiles(data, selected, 'audio'),
        };
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a lecture recording, podcast or video. We transcribe it and build the course from what&apos;s said.
      </p>
      <FileDrop
        accept="audio/*,video/*"
        hint="Audio or video up to 10 MB"
        file={file}
        disabled={disabled}
        onFile={handleFile}
      />
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <FieldError message={error} />
        <div className="sm:ml-auto">
          <SubmitButton disabled={disabled} />
        </div>
      </div>
    </form>
  );
};
