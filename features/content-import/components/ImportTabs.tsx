"use client"
import React, { useState } from 'react';
import { FileText, Link, Lightbulb, FileUp, Video, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImportResult, ImportTabProps } from '../utils/types';
import { TextImport } from './TextImport';
import { URLImport } from './URLImport';
import { TopicImport } from './TopicImport';
import { DocumentImport } from './DocumentImport';
import { VideoImport } from './VideoImport';
import { AudioImport } from './AudioImport';

const importTypes = [
  { id: 'text', label: 'Text', icon: FileText, description: 'Paste or type content directly' },
  { id: 'url', label: 'URL', icon: Link, description: 'Extract content from web pages' },
  { id: 'topic', label: 'Topic', icon: Lightbulb, description: 'Research Wikipedia or AI-generated content' },
  { id: 'document', label: 'Document', icon: FileUp, description: 'Upload PDF, DOCX, PPT files' },
  { id: 'video', label: 'Video', icon: Video, description: 'YouTube URLs or upload videos' },
  { id: 'audio', label: 'Audio', icon: Mic, description: 'Record or upload audio files' },
] as const;

type ImportTypeId = typeof importTypes[number]['id'];

export const ImportTabs: React.FC<ImportTabProps> = ({ onContentImport, isProcessing = false }) => {
  const [activeTab, setActiveTab] = useState<ImportTypeId>('text');
  const [processingStatus, setProcessingStatus] = useState<{ [key in ImportTypeId]?: boolean }>({});

  const handleContentImport = (result: ImportResult) => {
    onContentImport(result);
  };

  const handleProcessingChange = (type: ImportTypeId, isProcessing: boolean) => {
    setProcessingStatus(prev => ({ ...prev, [type]: isProcessing }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      },
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div 
      className="w-full px-4 sm:p-6 min-h-fit mt-2" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative group w-full max-w-4xl mx-auto">
        {/* Glass card */}
        <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden duration-300 border-2 border-foreground/10 bg-background/40 backdrop-blur-xl hover:border-border/60">
          {/* Subtle dot pattern background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--foreground)_0.02_1px,transparent_1px)] bg-[length:8px_8px]" />
          </div>

          <div className="relative flex flex-col space-y-6">
            {/* Tab Navigation */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              variants={itemVariants}
            >
              {importTypes.map((importType) => {
                const Icon = importType.icon;
                const isActive = activeTab === importType.id;
                const isTabProcessing = processingStatus[importType.id] || false;
                
                return (
                  <motion.button
                    key={importType.id}
                    onClick={() => setActiveTab(importType.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-geist-mono text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-foreground/10 text-foreground border border-foreground/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    } ${isTabProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    variants={buttonVariants}
                    disabled={isTabProcessing}
                    whileHover={{ scale: isTabProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isTabProcessing ? 1 : 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{importType.label}</span>
                    {isTabProcessing && (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Tab Content */}
            <motion.div 
              className="min-h-[200px]"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'text' && (
                <TextImport 
                  onContentImport={handleContentImport}
                  isProcessing={isProcessing}
                />
              )}
              {activeTab === 'url' && (
                <URLImport 
                  onContentImport={handleContentImport}
                  onProcessingChange={(processing) => handleProcessingChange('url', processing)}
                />
              )}
              {activeTab === 'topic' && (
                <TopicImport 
                  onContentImport={handleContentImport}
                  onProcessingChange={(processing) => handleProcessingChange('topic', processing)}
                />
              )}
              {activeTab === 'document' && (
                <DocumentImport 
                  onContentImport={handleContentImport}
                  onProcessingChange={(processing) => handleProcessingChange('document', processing)}
                />
              )}
              {activeTab === 'video' && (
                <VideoImport 
                  onContentImport={handleContentImport}
                  onProcessingChange={(processing) => handleProcessingChange('video', processing)}
                />
              )}
              {activeTab === 'audio' && (
                <AudioImport 
                  onContentImport={handleContentImport}
                  onProcessingChange={(processing) => handleProcessingChange('audio', processing)}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
