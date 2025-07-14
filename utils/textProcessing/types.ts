// ============================================================================
// Enhanced Chunk AI System - Type Definitions
// ============================================================================

// ============================================================================
// Core Data Structures
// ============================================================================

export interface Sentence {
  id: string;
  text: string;
  index: number;
  importance: number;
  topic?: string;
  context?: string;
  wordCount: number;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface courseMetadata {
  title: string,
  description: string,
  category: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  tags: string[] 
}

export interface SemanticChunk {
  id: string;
  sentences: Sentence[];
  topic: string;
  importance: number;
  keywords: string[];
  summary: string;
  wordCount: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
}

export interface TopicGroup {
  id: string;
  topic: string;
  chunks: SemanticChunk[];
  importance: number;
  description: string;
}

export interface ChunkHierarchy {
  id: string;
  groups: TopicGroup[];
  progression: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
}

// ============================================================================
// Lesson Generation Types
// ============================================================================

export interface Lesson {
  id: string;
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningObjectives: string[];
  exercises?: string[];
  resources?: string[];
}

export interface LessonProgression {
  lessons: Lesson[];
  flow: string[];
  transitions: string[];
  totalDuration: number;
  difficultyProgression: 'ascending' | 'descending' | 'mixed';
}

// ============================================================================
// Content Enhancement Types
// ============================================================================

export interface EnhancedContent {
  original: string;
  enhanced: string;
  keyPoints: string[];
  summary: string;
  transitions: string[];
  explanations: string[];
  examples: string[];
}

export interface ContentAnalysis {
  language: string;
  type: 'technical' | 'educational' | 'narrative' | 'mixed';
  complexity: 'simple' | 'moderate' | 'complex';
  topics: string[];
  keywords: string[];
  estimatedReadingTime: number;
  readabilityScore: number;
}

// ============================================================================
// AI Integration Types
// ============================================================================

export interface AIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    model: string;
    tokens: number;
    duration: number;
    timestamp: number;
  };
}

export interface AIPrompt {
  system: string;
  user: string;
  context?: unknown;
  temperature?: number;
  maxOutputTokens?: number;
}

// ============================================================================
// Processing Pipeline Types
// ============================================================================

export interface ProcessingOptions {
  maxChunkSize: number;
  minChunkSize: number;
  overlapPercentage: number;
  enableEnhancement: boolean;
  enableProgression: boolean;
  targetLessonCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ProcessingResult {
  success: boolean;
  course: {
    title: string;
    description: string;
    lessons: Lesson[];
  };
  metadata: {
    processingTime: number;
    chunkCount: number;
    lessonCount: number;
    enhancementApplied: boolean;
    aiCalls: number;
  };
  errors?: string[];
}

// ============================================================================
// Error Handling Types
// ============================================================================

export interface ProcessingError {
  type: 'chunking' | 'ai' | 'enhancement' | 'validation';
  message: string;
  context?: unknown;
  recoverable: boolean;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface ChunkAIConfig {
  ai: {
    model: string;
    apiKey: string;
    temperature: number;
    maxTokens: number;
    retryAttempts: number;
  };
  processing: {
    defaultOptions: ProcessingOptions;
    enableCaching: boolean;
    cacheExpiry: number;
  };
  enhancement: {
    enableNarrativeFlow: boolean;
    enableExplanations: boolean;
    enableExamples: boolean;
    enableTransitions: boolean;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export type ChunkingStrategy = 'semantic' | 'fixed-size' | 'hybrid';
export type EnhancementLevel = 'minimal' | 'moderate' | 'comprehensive';
export type ProgressionType = 'linear' | 'spiral' | 'modular';

export interface ChunkingResult {
  chunks: SemanticChunk[];
  strategy: ChunkingStrategy;
  metadata: {
    originalWordCount: number;
    chunkCount: number;
    averageChunkSize: number;
    processingTime: number;
  };
}

export interface EnhancementResult {
  enhanced: EnhancedContent;
  level: EnhancementLevel;
  metadata: {
    originalLength: number;
    enhancedLength: number;
    additions: number;
    processingTime: number;
  };
} 