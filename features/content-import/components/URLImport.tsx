"use client"
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, ExternalLink, Loader2, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImportResult } from '../utils/types';
import { useAuth } from '@/hooks/useAuth';

interface URLImportProps {
  onContentImport: (result: ImportResult) => void;
  onProcessingChange: (processing: boolean) => void;
}

export const URLImport: React.FC<URLImportProps> = ({ onContentImport, onProcessingChange }) => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<{ title?: string; description?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleExtractContent = useCallback(async () => {
    if (!url.trim() || !validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);
    setPreview(null);

    try {
      const response = await fetch('/api/v1/content-import/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract content from URL');
      }

      const data = await response.json();
      
      const result: ImportResult = {
        type: 'url',
        content: data.content,
        metadata: {
          source: url,
          title: data.title || 'Web Content',
          fileType: 'webpage'
        }
      };

      setPreview({
        title: data.title,
        description: data.description
      });

      onContentImport(result);
    } catch (error) {
      console.error('Error extracting URL content:', error);
      setError(error instanceof Error ? error.message : 'Failed to extract content');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  }, [url, onContentImport, onProcessingChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleExtractContent();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Extract Content from URL</h3>
        <p className="text-sm text-muted-foreground">
          Enter a web page URL to extract and process its content
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleExtractContent}
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
                <Link className="w-4 h-4 mr-2" />
                Extract
              </>
            )}
          </Button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/20 border border-border/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">
                  {preview.title || 'Web Content'}
                </h4>
                {preview.description && (
                  <p className="text-sm text-muted-foreground">
                    {preview.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Content extracted successfully and ready for course creation
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
