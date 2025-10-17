"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FileUp, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImportResult } from '../utils/types';

// Auth is handled by the protected layout
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';

interface DocumentImportProps {
  onContentImport: (result: ImportResult) => void;
  onProcessingChange: (processing: boolean) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

export const DocumentImport: React.FC<DocumentImportProps> = ({ onContentImport, onProcessingChange }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUppy, setShowUppy] = useState(false);
  const uppyRef = useRef<Uppy | null>(null);
    // Auth is handled by the protected layout

  const acceptedTypes = React.useMemo(() => [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
  ], []);

  const getFileTypeLabel = (type: string): string => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('wordprocessingml')) return 'DOCX';
    if (type.includes('msword')) return 'DOC';
    if (type.includes('presentationml')) return 'PPTX';
    if (type.includes('ms-powerpoint')) return 'PPT';
    return 'Document';
  };

  // Initialize Uppy
  useEffect(() => {
    if (!uppyRef.current) {
      uppyRef.current = new Uppy({
        restrictions: {
          maxFileSize: 50 * 1024 * 1024, // 50MB
          allowedFileTypes: acceptedTypes,
          maxNumberOfFiles: 5
        },
        autoProceed: false,
        allowMultipleUploadBatches: false
      });

      // Add XHRUpload plugin
      uppyRef.current.use(XHRUpload, {
        endpoint: '/api/v1/content-import/document',
        fieldName: 'document',
        formData: true, // Changed to true for Vercel Blob upload
        bundle: false,
        getResponseData: (xhr: XMLHttpRequest) => {
          try {
            return { body: JSON.parse(xhr.responseText) };
          } catch {
            return { body: { content: 'Document processed successfully' } };
          }
        }
      });

      // Handle upload start
      uppyRef.current.on('upload', async () => {
        setIsProcessing(true);
        onProcessingChange(true);
      });

      // Handle upload success
      uppyRef.current.on('upload-success', async (file, response) => {
        if (!file) return;
        
        try {
          const result: ImportResult = {
            type: 'document',
            content: response.body?.content || 'Document processed successfully',
            blobUrl: response.body?.blobUrl,
            blobPathname: response.body?.blobPathname,
            metadata: {
              source: file.name || 'unknown',
              title: response.body?.title || file.name || 'Document',
              fileType: getFileTypeLabel(file.type || 'application/octet-stream'),
              fileSize: file.size || 0
            }
          };

          onContentImport(result);

          // Update file status
          setFiles(prev => [...prev, {
            id: file.id,
            name: file.name || 'unknown',
            size: file.size || 0,
            type: file.type || 'application/octet-stream',
            status: 'completed',
            progress: 100
          }]);

        } catch (error) {
          console.error('Error processing upload result:', error);
          setFiles(prev => [...prev, {
            id: file.id,
            name: file.name || 'unknown',
            size: file.size || 0,
            type: file.type || 'application/octet-stream',
            status: 'error',
            error: 'Failed to process document'
          }]);
        }
      });

      // Handle upload error
      uppyRef.current.on('upload-error', (file, error) => {
        if (!file) return;
        
        console.error('Upload error:', error);
        setFiles(prev => [...prev, {
          id: file.id,
          name: file.name || 'unknown',
          size: file.size || 0,
          type: file.type || 'application/octet-stream',
          status: 'error',
          error: error.message || 'Upload failed'
        }]);
      });

      // Handle upload complete
      uppyRef.current.on('complete', () => {
        setIsProcessing(false);
        onProcessingChange(false);
      });

      // Handle file added
      uppyRef.current.on('file-added', (file) => {
        if (!file) return;
        
        setFiles(prev => [...prev, {
          id: file.id,
          name: file.name || 'unknown',
          size: file.size || 0,
          type: file.type || 'application/octet-stream',
          status: 'uploading',
          progress: 0
        }]);
      });

      // Handle file removed
      uppyRef.current.on('file-removed', (file) => {
        if (!file) return;
        setFiles(prev => prev.filter(f => f.id !== file.id));
      });

      // Handle upload progress
      uppyRef.current.on('upload-progress', (file, progress) => {
        if (!file || !progress.bytesTotal) return;
        
        const progressPercent = Math.round((progress.bytesUploaded || 0) / (progress.bytesTotal || 1) * 100);
        
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress: progressPercent }
            : f
        ));
      });
    }

    return () => {
      if (uppyRef.current) {
        uppyRef.current.destroy();
      }
    };
  }, [onContentImport, onProcessingChange, acceptedTypes]);

  const handleUploadClick = () => {
    if (uppyRef.current) {
      uppyRef.current.upload();
    }
  };

  const removeFile = (fileId: string) => {
    if (uppyRef.current) {
      uppyRef.current.removeFile(fileId);
    }
  };

  const clearAllFiles = () => {
    if (uppyRef.current) {
      uppyRef.current.cancelAll();
    }
    setFiles([]);
  };

  const toggleUppyDashboard = () => {
    setShowUppy(!showUppy);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">Upload Documents</h3>
        <p className="text-sm text-muted-foreground">
          Upload PDF, DOCX, DOC, PPT, or PPTX files directly to AI
        </p>
      </div>

      {/* Custom UI that triggers Uppy */}
      <div className="space-y-4">
        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={toggleUppyDashboard}
            className={cn(
              "px-6 py-3 rounded-lg transition-colors flex items-center gap-2",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <FileUp className="w-5 h-5" />
            {files.length > 0 ? 'Manage Files' : 'Upload Documents'}
          </button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-foreground">Selected Files</h4>
              <div className="flex gap-2">
                {files.some(f => f.status === 'uploading') && (
                  <button
                    onClick={handleUploadClick}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                  >
                    {isProcessing ? 'Processing...' : 'Process Files'}
                  </button>
                )}
                <button
                  onClick={clearAllFiles}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-muted/20 border border-border/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {file.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : file.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : file.status === 'uploading' ? (
                      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    ) : (
                      <FileUp className="w-5 h-5 text-muted-foreground" />
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getFileTypeLabel(file.type)} • {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      {file.error && (
                        <p className="text-xs text-red-400">{file.error}</p>
                      )}
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden Uppy Dashboard */}
        {showUppy && uppyRef.current && (
          <div className="border border-border/30 rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/10 border-b border-border/30 flex justify-between items-center">
              <h4 className="font-medium text-foreground">File Upload</h4>
              <button
                onClick={toggleUppyDashboard}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <Dashboard
                uppy={uppyRef.current}
                width="100%"
                height={300}
                proudlyDisplayPoweredByUppy={false}
                hideUploadButton={false}
                hideRetryButton={false}
                hidePauseResumeButton={false}
                hideCancelButton={false}
                showRemoveButtonAfterComplete={true}
                note="PDF, DOCX, DOC, PPT, PPTX files up to 50MB"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
