"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { FieldError, SubmitButton } from './SourceFormParts';
import { SourceFormProps } from './sourceTypes';
import { postImport } from '../utils/importClient';

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes('.') ? url.toString() : null;
  } catch {
    return null;
  }
}

export const URLImport: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError('Enter a valid web address, like https://example.com/article');
      return;
    }
    if (/youtube\.com|youtu\.be/i.test(normalized)) {
      setError('That looks like a YouTube link — use the “YouTube link” option instead.');
      return;
    }
    setError(null);
    onSubmit({
      sourceType: 'url',
      prepare: async () => {
        const data = await postImport<{ content: string; title?: string }>('url', { url: normalized });
        return { text: data.content, sourceType: 'url' };
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="source-url" className="block text-sm text-muted-foreground">
        Paste the link to a blog post, article or documentation page.
      </label>
      <Input
        id="source-url"
        type="text"
        inputMode="url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError(null);
        }}
        disabled={disabled}
        placeholder="https://example.com/article"
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
