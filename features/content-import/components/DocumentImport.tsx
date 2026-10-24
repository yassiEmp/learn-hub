"use client"
import React, { useState } from 'react';
import { FieldError, FileDrop, SubmitButton } from './SourceFormParts';
import { BlobUpload, SourceFormProps, toSourceFiles } from './sourceTypes';
import { postImportForm } from '../utils/importClient';

const MAX_BYTES = 50 * 1024 * 1024;

interface DocumentImportResponse extends BlobUpload {
  content: string;
  title?: string;
}

export const DocumentImport: React.FC<SourceFormProps> = ({ disabled, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File | null) => {
    setError(null);
    if (f && f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.');
      return;
    }
    if (f && f.size > MAX_BYTES) {
      setError('This PDF is larger than 50 MB. Try a smaller file.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Choose a PDF to continue.');
      return;
    }
    const selected = file;
    onSubmit({
      sourceType: 'pdf',
      prepare: async () => {
        const form = new FormData();
        form.append('document', selected);
        const data = await postImportForm<DocumentImportResponse>('document', form);
        return {
          text: data.content,
          sourceType: 'pdf',
          sourceFiles: toSourceFiles(data, selected, 'document'),
        };
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a PDF — lecture slides, a textbook chapter, a paper.
      </p>
      <FileDrop
        accept="application/pdf,.pdf"
        hint="PDF up to 50 MB"
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
