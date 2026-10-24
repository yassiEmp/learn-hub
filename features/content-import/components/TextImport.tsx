"use client"
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { FieldError, SubmitButton } from './SourceFormParts';
import { SourceFormProps } from './sourceTypes';

const MIN_CHARS = 100;

export const TextImport: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const length = text.trim().length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (length < MIN_CHARS) {
      setError(`Paste a bit more text — at least ${MIN_CHARS} characters (you have ${length}).`);
      return;
    }
    setError(null);
    const content = text.trim();
    onSubmit({
      sourceType: 'text',
      prepare: async () => ({ text: content, sourceType: 'text' }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="source-text" className="block text-sm text-muted-foreground">
        Paste your notes, an article, a chapter — anything you want to learn from.
      </label>
      <Textarea
        id="source-text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(null);
        }}
        disabled={disabled}
        rows={10}
        placeholder="Paste your text here…"
        className="min-h-[220px] resize-y text-sm sm:text-base disabled:opacity-60"
      />
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{length.toLocaleString()} characters</p>
          <FieldError message={error} />
        </div>
        <SubmitButton disabled={disabled} />
      </div>
    </form>
  );
};
