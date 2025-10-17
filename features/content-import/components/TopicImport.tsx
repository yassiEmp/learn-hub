"use client"
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lightbulb, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImportResult } from '../utils/types';
// Auth is handled by the protected layout

interface TopicImportProps {
  onContentImport: (result: ImportResult) => void;
  onProcessingChange: (processing: boolean) => void;
}

export const TopicImport: React.FC<TopicImportProps> = ({ onContentImport, onProcessingChange }) => {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [source, setSource] = useState<'wikipedia' | 'ai'>('wikipedia');
  const [error, setError] = useState<string | null>(null);
    // Auth is handled by the protected layout

  const handleGenerateContent = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsProcessing(true);
    onProcessingChange(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/content-import/topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          source
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content for topic');
      }

      const data = await response.json();

      const result: ImportResult = {
        type: 'topic',
        content: data.content,
        metadata: {
          source: source === 'wikipedia' ? 'Wikipedia' : 'AI Generated',
          title: data.title || topic,
          fileType: 'research'
        }
      };

      onContentImport(result);
    } catch (error) {
      console.error('Error generating topic content:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsProcessing(false);
      onProcessingChange(false);
    }
  }, [topic, source, onContentImport, onProcessingChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleGenerateContent();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Research Topic</h3>
        <p className="text-sm text-muted-foreground">
          Enter a topic to research from Wikipedia or generate AI content
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="e.g., Machine Learning, Quantum Computing, Climate Change"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            className="w-full"
          />

          {/* Source Selection */}
          <div className="flex gap-2 sm:flex-row flex-col">
            <Button
              variant={source === 'wikipedia' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSource('wikipedia')}
              disabled={isProcessing}
              className="flex-1 sm:w-auto w-full h-16 p-3 sm:p-1"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Wikipedia
            </Button>
            <Button
              variant={source === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSource('ai')}
              disabled={isProcessing}
              className="flex-1 sm:w-auto w-full h-16 p-3 sm:p-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generated
            </Button>
          </div>
        </div>

        <Button
          onClick={handleGenerateContent}
          disabled={isProcessing}
            className={cn(
              "w-full",
              "bg-primary hover:bg-primary/90"
            )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {source === 'wikipedia' ? 'Researching...' : 'Generating...'}
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 mr-2" />
              {source === 'wikipedia' ? 'Research Topic' : 'Generate Content'}
            </>
          )}
        </Button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="text-xs flex justify-center items-center">
          <p className='text-muted-foreground text-center p-1 bg-muted/80 border border-border/30 rounded-lg'>
            {source === 'wikipedia'
              ? 'Content will be extracted from Wikipedia articles'
              : 'Content will be generated using AI based on the topic'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
