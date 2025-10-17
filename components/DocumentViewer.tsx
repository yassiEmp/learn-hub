import React, { useState } from 'react';
import { FileText, Download, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentFile {
  url: string;
  pathname: string;
  type: 'document' | 'audio' | 'image';
  filename: string;
  size: number;
  uploadedAt: string;
  canDownload?: boolean;
  accessLevel?: 'owner' | 'viewer';
}

interface DocumentViewerProps {
  files: DocumentFile[];
  courseId: string;
  isOwner?: boolean;
  className?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  files, 
  courseId, 
  isOwner = false,
  className = '' 
}) => {
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'audio':
        return <FileText className="w-5 h-5" />; // You might want a different icon
      case 'image':
        return <FileText className="w-5 h-5" />; // You might want a different icon
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'audio':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'image':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const handleFileSelect = (file: DocumentFile) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleDownload = async (file: DocumentFile) => {
    if (!file.canDownload) {
      setError('You do not have permission to download this file');
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would fetch the file through your API
      // to ensure proper access control
      const response = await fetch(`/api/v1/course/${courseId}/files/${encodeURIComponent(file.pathname)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const data = await response.json();
      console.log(isOwner)
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = data.data.file.downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download file');
    } finally {
      setIsLoading(false);
    }
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 font-geist-mono">No documents available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File List */}
      <div className="grid gap-3">
        {files.map((file, index) => (
          <motion.div
            key={file.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:border-white/30 ${
              selectedFile?.pathname === file.pathname
                ? 'border-white/50 bg-white/5'
                : 'border-white/10 bg-white/5'
            }`}
            onClick={() => handleFileSelect(file)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getFileTypeColor(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    {file.filename}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 font-geist-mono">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                    {file.accessLevel && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{file.accessLevel}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.canDownload && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    disabled={isLoading}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(selectedFile?.pathname === file.pathname ? null : file);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                >
                  {selectedFile?.pathname === file.pathname ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-geist-mono">{error}</span>
        </motion.div>
      )}

      {/* File Preview/Details */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-white/10 bg-white/5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              {selectedFile.filename}
            </h3>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between">
              <span className="font-geist-mono">Type:</span>
              <span className="capitalize">{selectedFile.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-geist-mono">Size:</span>
              <span>{formatFileSize(selectedFile.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-geist-mono">Uploaded:</span>
              <span>{formatDate(selectedFile.uploadedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-geist-mono">Access:</span>
              <span className="capitalize">{selectedFile.accessLevel || 'Unknown'}</span>
            </div>
          </div>

          {selectedFile.canDownload && (
            <div className="mt-6">
              <button
                onClick={() => handleDownload(selectedFile)}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="font-geist-mono">Download File</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

