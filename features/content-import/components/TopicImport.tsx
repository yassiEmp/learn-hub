"use client"
import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { FieldError, SubmitButton } from './SourceFormParts';
import { SourceFormProps } from './sourceTypes';
import { postImport } from '../utils/importClient';

type TopicSource = 'ai' | 'wikipedia';

export const TopicImport: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [source, setSource] = useState<TopicSource>('ai');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = topic.trim();
    if (value.length < 3) {
      setError('Type a topic — for example “Photosynthesis” or “Intro to SQL joins”.');
      return;
    }
    setError(null);
    const chosen = source;
    onSubmit({
      sourceType: 'topic',
      prepare: async () => {
        const data = await postImport<{ content: string; title?: string }>('topic', {
          topic: value,
          source: chosen,
        });
        return { text: data.content, sourceType: 'topic' };
      },
    });
  };

  const options: { id: TopicSource; label: string; icon: typeof Sparkles }[] = [
    { id: 'ai', label: 'AI explains it', icon: Sparkles },
    { id: 'wikipedia', label: 'From Wikipedia', icon: BookOpen },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="source-topic" className="block text-sm text-muted-foreground">
        No material? Just name what you want to learn.
      </label>
      <Input
        id="source-topic"
        type="text"
        value={topic}
        onChange={(e) => {
          setTopic(e.target.value);
          if (error) setError(null);
        }}
        disabled={disabled}
        placeholder="e.g. Machine learning basics, The French Revolution, React hooks"
        className="h-12 bg-foreground/5 border-foreground/15 text-foreground"
      />
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Where should the content come from?">
        {options.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={source === id}
            disabled={disabled}
            onClick={() => setSource(id)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors disabled:opacity-50',
              source === id
                ? 'border-foreground/40 bg-foreground/10 text-foreground'
                : 'border-foreground/10 text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <FieldError message={error} />
        <div className="sm:ml-auto">
          <SubmitButton disabled={disabled} />
        </div>
      </div>
    </form>
  );
};
