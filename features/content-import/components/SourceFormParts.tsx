"use client"
import React, { useRef, useState } from 'react';
import { AlertCircle, ArrowRight, FileUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from './sourceTypes';

export const FieldError: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <p role="alert" className="flex items-center gap-2 text-sm text-red-400">
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </p>
  ) : null;

export const SubmitButton: React.FC<{ disabled: boolean; label?: string }> = ({
  disabled,
  label = 'Create my course',
}) => (
  <button
    type="submit"
    disabled={disabled}
    className={cn(
      'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium font-geist-mono',
      'bg-foreground text-background hover:bg-foreground/90 transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto'
    )}
  >
    {label}
    <ArrowRight className="w-4 h-4" />
  </button>
);

interface FileDropProps {
  accept: string;
  hint: string;
  file: File | null;
  disabled: boolean;
  onFile: (file: File | null) => void;
}

/** Click-or-drop single file picker. Validation is left to the caller. */
export const FileDrop: React.FC<FileDropProps> = ({ accept, hint, file, disabled, onFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  if (file) {
    return (
      <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-foreground/15 bg-foreground/5">
        <div className="flex items-center gap-3 min-w-0">
          <FileUp className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onFile(null)}
          disabled={disabled}
          aria-label="Remove file"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled && e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors',
        dragOver ? 'border-foreground/50 bg-foreground/10' : 'border-foreground/15 hover:border-foreground/30',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <FileUp className="w-10 h-10 text-muted-foreground" />
      <p className="text-foreground font-medium">Drop a file here or click to browse</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />
    </div>
  );
};
