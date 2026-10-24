"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { FieldError, SubmitButton } from './SourceFormParts';
import { BlobUpload, SourceFormProps } from './sourceTypes';
import { postImport } from '../utils/importClient';

interface VideoImportResponse extends BlobUpload {
  transcript: string;
  title?: string;
}

const YOUTUBE_RE =
  /^(https?:\/\/)?((www|m)\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)[\w-]{6,}/i;

/** YouTube link → transcript → course. */
export const VideoImport: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = url.trim();
    if (!YOUTUBE_RE.test(value)) {
      setError('Enter a YouTube link, like https://www.youtube.com/watch?v=…');
      return;
    }
    setError(null);
    const link = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    onSubmit({
      sourceType: 'youtube',
      prepare: async () => {
        const data = await postImport<VideoImportResponse>('video', { url: link, type: 'youtube' });
        return { text: data.transcript, sourceType: 'youtube' };
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="source-youtube" className="block text-sm text-muted-foreground">
        Paste a YouTube link. We use the video&apos;s captions, so it needs subtitles enabled.
      </label>
      <Input
        id="source-youtube"
        type="text"
        inputMode="url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError(null);
        }}
        disabled={disabled}
        placeholder="https://www.youtube.com/watch?v=…"
        className="h-12 bg-foreground/5 border-foreground/15 text-foreground"
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
