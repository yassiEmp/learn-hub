"use client"
import React, { useState } from 'react';
import { FileText, FileUp, Globe, Youtube, Lightbulb, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextImport } from './TextImport';
import { DocumentImport } from './DocumentImport';
import { URLImport } from './URLImport';
import { VideoImport } from './VideoImport';
import { TopicImport } from './TopicImport';
import { AudioImport } from './AudioImport';
import { SourceFormProps } from './sourceTypes';

const sources = [
  { id: 'text', label: 'Paste text / notes', hint: 'Notes, articles, chapters', icon: FileText, Form: TextImport },
  { id: 'pdf', label: 'Upload PDF', hint: 'Slides, books, papers', icon: FileUp, Form: DocumentImport },
  { id: 'url', label: 'Web article URL', hint: 'Blogs, docs, Wikipedia', icon: Globe, Form: URLImport },
  { id: 'youtube', label: 'YouTube link', hint: 'Lectures & tutorials', icon: Youtube, Form: VideoImport },
  { id: 'topic', label: 'Just a topic', hint: 'No material needed', icon: Lightbulb, Form: TopicImport },
  { id: 'media', label: 'Audio / Video upload', hint: 'Recordings, podcasts', icon: AudioLines, Form: AudioImport },
] as const;

type SourceId = (typeof sources)[number]['id'];

/** Source picker (6 selectable cards) + the selected source's input form. */
export const ImportTabs: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [active, setActive] = useState<SourceId>('text');
  const current = sources.find((s) => s.id === active) ?? sources[0];
  const ActiveForm = current.Form;

  return (
    <div className="w-full space-y-6">
      <div
        role="radiogroup"
        aria-label="Choose your source"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {sources.map(({ id, label, hint, icon: Icon }) => {
          const selected = id === active;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled && !selected}
              onClick={() => setActive(id)}
              className={cn(
                'flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200',
                selected
                  ? 'border-foreground/50 bg-foreground/10 shadow-sm'
                  : 'border-foreground/10 bg-background/40 hover:border-foreground/25 hover:bg-foreground/5',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              <Icon className={cn('w-5 h-5', selected ? 'text-foreground' : 'text-muted-foreground')} />
              <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
              <span className="text-xs text-muted-foreground leading-tight hidden sm:block">{hint}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background/60 backdrop-blur-xl">
        {/* key resets the form state when switching sources */}
        <ActiveForm key={current.id} disabled={disabled} onSubmit={onSubmit} />
      </div>
    </div>
  );
};
