// ============================================================================
// Semantic Chunking Engine
// ============================================================================

import { Sentence, SemanticChunk , ChunkingStrategy, ChunkingResult } from '../types';
import { createSentenceClusters, groupSentencesByTopic } from '../preprocessor/sentenceSplitter';

/**
 * Creates semantic chunks from sentences
 */
export function createSemanticChunks(sentences: Sentence[]): SemanticChunk[] {
  if (sentences.length === 0) {
    return [];
  }

  const chunks: SemanticChunk[] = [];
  
  // Strategy 1: Group by topic
  const topicGroups = groupSentencesByTopic(sentences);
  
  topicGroups.forEach((topicSentences, topic) => {
    if (topicSentences.length === 0) return;
    
    // Create chunks within each topic
    const topicChunks = createChunksWithinTopic(topicSentences, topic);
    chunks.push(...topicChunks);
  });
  
  // Strategy 2: Use sentence clusters for better semantic grouping
  const clusters = createSentenceClusters(sentences);
  
  clusters.forEach((cluster, index) => {
    if (cluster.length === 0) return;
    
    const chunk = createChunkFromCluster(cluster, `cluster_${index}`);
    chunks.push(chunk);
  });
  
  // Merge overlapping chunks
  const mergedChunks = mergeOverlappingChunks(chunks);
  
  // Ensure minimum chunk size
  const finalChunks = ensureMinimumChunkSize(mergedChunks);
  
  return finalChunks;
}

/**
 * Creates chunks within a specific topic
 */
function createChunksWithinTopic(sentences: Sentence[], topic: string): SemanticChunk[] {
  const chunks: SemanticChunk[] = [];
  const maxChunkSize = 300; // words
  let currentChunk: Sentence[] = [];
  let currentWordCount = 0;
  
  sentences.forEach(sentence => {
    if (currentWordCount + sentence.wordCount > maxChunkSize && currentChunk.length > 0) {
      // Create chunk from current sentences
      const chunk = createChunkFromSentences(currentChunk, topic);
      chunks.push(chunk);
      
      // Start new chunk
      currentChunk = [sentence];
      currentWordCount = sentence.wordCount;
    } else {
      currentChunk.push(sentence);
      currentWordCount += sentence.wordCount;
    }
  });
  
  // Add final chunk
  if (currentChunk.length > 0) {
    const chunk = createChunkFromSentences(currentChunk, topic);
    chunks.push(chunk);
  }
  
  return chunks;
}

/**
 * Creates a chunk from a sentence cluster
 */
function createChunkFromCluster(cluster: Sentence[], id: string): SemanticChunk {
  const sentences = cluster.sort((a, b) => a.index - b.index);
  const topic = detectClusterTopic(cluster);
  const importance = calculateClusterImportance(cluster);
  const keywords = extractClusterKeywords(cluster);
  const summary = generateClusterSummary(cluster);
  const wordCount = cluster.reduce((sum, s) => sum + s.wordCount, 0);
  const complexity = determineClusterComplexity(cluster);
  const prerequisites = extractPrerequisites(cluster);
  
  return {
    id,
    sentences,
    topic,
    importance,
    keywords,
    summary,
    wordCount,
    complexity,
    prerequisites
  };
}

/**
 * Creates a chunk from a list of sentences
 */
function createChunkFromSentences(sentences: Sentence[], topic: string): SemanticChunk {
  const id = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const importance = calculateClusterImportance(sentences);
  const keywords = extractClusterKeywords(sentences);
  const summary = generateClusterSummary(sentences);
  const wordCount = sentences.reduce((sum, s) => sum + s.wordCount, 0);
  const complexity = determineClusterComplexity(sentences);
  const prerequisites = extractPrerequisites(sentences);
  
  return {
    id,
    sentences,
    topic,
    importance,
    keywords,
    summary,
    wordCount,
    complexity,
    prerequisites
  };
}

/**
 * Detects the primary topic of a sentence cluster
 */
function detectClusterTopic(cluster: Sentence[]): string {
  const topicCounts = new Map<string, number>();
  
  cluster.forEach(sentence => {
    const topic = sentence.topic || 'general';
    topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
  });
  
  let primaryTopic = 'general';
  let maxCount = 0;
  
  topicCounts.forEach((count, topic) => {
    if (count > maxCount) {
      maxCount = count;
      primaryTopic = topic;
    }
  });
  
  return primaryTopic;
}

/**
 * Calculates the importance of a sentence cluster
 */
function calculateClusterImportance(cluster: Sentence[]): number {
  if (cluster.length === 0) return 0;
  
  const totalImportance = cluster.reduce((sum, sentence) => sum + sentence.importance, 0);
  const averageImportance = totalImportance / cluster.length;
  
  // Boost importance for larger clusters (more comprehensive)
  const sizeBonus = Math.min(cluster.length * 0.5, 3);
  
  return Math.min(10, averageImportance + sizeBonus);
}

/**
 * Extracts keywords from a sentence cluster
 */
function extractClusterKeywords(cluster: Sentence[]): string[] {
  const wordFreq: { [key: string]: number } = {};
  
  cluster.forEach(sentence => {
    const words = sentence.text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  });
  
  // Filter out common words
  const commonWords = new Set([
    'this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been',
    'good', 'much', 'some', 'time', 'very', 'when', 'come', 'just', 'into', 'than',
    'more', 'other', 'about', 'many', 'then', 'them', 'these', 'people', 'only',
    'well', 'also', 'over', 'still', 'take', 'every', 'think', 'here', 'again',
    'another', 'around', 'away', 'because', 'before', 'below', 'between', 'during',
    'first', 'found', 'great', 'through', 'under', 'where', 'while', 'without'
  ]);
  
  const keywords = Object.entries(wordFreq)
    .filter(([word]) => !commonWords.has(word))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
  
  return keywords;
}

/**
 * Generates a summary for a sentence cluster
 */
function generateClusterSummary(cluster: Sentence[]): string {
  if (cluster.length === 0) return '';
  
  // Use the most important sentence as a starting point
  const mostImportant = cluster.reduce((max, sentence) => 
    sentence.importance > max.importance ? sentence : max
  );
  
  // If cluster is small, use the most important sentence
  if (cluster.length <= 2) {
    return mostImportant.text;
  }
  
  // For larger clusters, create a summary
  const keySentences = cluster
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index)
    .map(s => s.text);
  
  return keySentences.join(' ');
}

/**
 * Determines the complexity level of a cluster
 */
function determineClusterComplexity(cluster: Sentence[]): 'beginner' | 'intermediate' | 'advanced' {
  if (cluster.length === 0) return 'beginner';
  
  const complexityCounts = {
    simple: 0,
    moderate: 0,
    complex: 0
  };
  
  cluster.forEach(sentence => {
    complexityCounts[sentence.complexity]++;
  });
  
  const total = cluster.length;
  const simpleRatio = complexityCounts.simple / total;
  const complexRatio = complexityCounts.complex / total;
  
  if (complexRatio > 0.5) return 'advanced';
  if (simpleRatio > 0.6) return 'beginner';
  return 'intermediate';
}

/**
 * Extracts prerequisites from a cluster
 */
function extractPrerequisites(cluster: Sentence[]): string[] {
  const prerequisites: string[] = [];
  
  const prerequisitePatterns = [
    /\b(before|prior to|first|initially|previously)\b/gi,
    /\b(assume|assumption|prerequisite|requirement|needed)\b/gi,
    /\b(understand|know|familiar with|experience with)\b/gi
  ];
  
  cluster.forEach(sentence => {
    prerequisitePatterns.forEach(pattern => {
      if (pattern.test(sentence.text)) {
        // Extract the concept mentioned after prerequisite indicators
        const match = sentence.text.match(/(?:before|prior to|first|initially|previously|assume|assumption|prerequisite|requirement|needed|understand|know|familiar with|experience with)\s+([^.!?]+)/i);
        if (match && match[1]) {
          prerequisites.push(match[1].trim());
        }
      }
    });
  });
  
  return [...new Set(prerequisites)]; // Remove duplicates
}

/**
 * Merges overlapping chunks
 */
function mergeOverlappingChunks(chunks: SemanticChunk[]): SemanticChunk[] {
  const merged: SemanticChunk[] = [];
  const used = new Set<string>();
  
  chunks.forEach(chunk => {
    if (used.has(chunk.id)) return;
    
    let currentChunk = chunk;
    used.add(chunk.id);
    
    // Find overlapping chunks
    chunks.forEach(otherChunk => {
      if (used.has(otherChunk.id)) return;
      
      if (areChunksOverlapping(currentChunk, otherChunk)) {
        currentChunk = mergeChunks(currentChunk, otherChunk);
        used.add(otherChunk.id);
      }
    });
    
    merged.push(currentChunk);
  });
  
  return merged;
}

/**
 * Checks if two chunks overlap significantly
 */
function areChunksOverlapping(chunk1: SemanticChunk, chunk2: SemanticChunk): boolean {
  // Same topic
  if (chunk1.topic === chunk2.topic && chunk1.topic !== 'general') {
    return true;
  }
  
  // Shared keywords
  const keywords1 = new Set(chunk1.keywords);
  const keywords2 = new Set(chunk2.keywords);
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  
  if (intersection.size >= 2) {
    return true;
  }
  
  // Similar complexity and importance
  if (chunk1.complexity === chunk2.complexity && 
      Math.abs(chunk1.importance - chunk2.importance) <= 2) {
    return true;
  }
  
  return false;
}

/**
 * Merges two chunks
 */
function mergeChunks(chunk1: SemanticChunk, chunk2: SemanticChunk): SemanticChunk {
  const allSentences = [...chunk1.sentences, ...chunk2.sentences]
    .sort((a, b) => a.index - b.index);
  
  const topic = chunk1.topic === chunk2.topic ? chunk1.topic : 'mixed';
  const importance = Math.max(chunk1.importance, chunk2.importance);
  const keywords = [...new Set([...chunk1.keywords, ...chunk2.keywords])].slice(0, 8);
  const summary = chunk1.summary.length > chunk2.summary.length ? chunk1.summary : chunk2.summary;
  const wordCount = chunk1.wordCount + chunk2.wordCount;
  const complexity = chunk1.complexity === 'advanced' || chunk2.complexity === 'advanced' ? 'advanced' :
                    chunk1.complexity === 'intermediate' || chunk2.complexity === 'intermediate' ? 'intermediate' : 'beginner';
  const prerequisites = [...new Set([...chunk1.prerequisites, ...chunk2.prerequisites])];
  
  return {
    id: `merged_${chunk1.id}_${chunk2.id}`,
    sentences: allSentences,
    topic,
    importance,
    keywords,
    summary,
    wordCount,
    complexity,
    prerequisites
  };
}

/**
 * Ensures chunks meet minimum size requirements
 */
function ensureMinimumChunkSize(chunks: SemanticChunk[]): SemanticChunk[] {
  const minWordCount = 50;
  const minSentences = 2;
  
  return chunks.filter(chunk => 
    chunk.wordCount >= minWordCount && chunk.sentences.length >= minSentences
  );
}

/**
 * Main semantic chunking function with strategy selection
 */
export function chunkText(
  sentences: Sentence[], 
  strategy: ChunkingStrategy = 'semantic',
  options?: {
    maxChunkSize?: number;
    minChunkSize?: number;
    overlapPercentage?: number;
  }
): ChunkingResult {
  const startTime = Date.now();
  const originalWordCount = sentences.reduce((sum, s) => sum + s.wordCount, 0);
  
  let chunks: SemanticChunk[];
  
  switch (strategy) {
    case 'semantic':
      chunks = createSemanticChunks(sentences);
      break;
    case 'fixed-size':
      chunks = createFixedSizeChunks(sentences, options?.maxChunkSize || 200);
      break;
    case 'hybrid':
      chunks = createHybridChunks(sentences, options);
      break;
    default:
      chunks = createSemanticChunks(sentences);
  }
  
  const processingTime = Date.now() - startTime;
  const chunkCount = chunks.length;
  const averageChunkSize = chunks.length > 0 ? 
    chunks.reduce((sum, c) => sum + c.wordCount, 0) / chunks.length : 0;
  
  return {
    chunks,
    strategy,
    metadata: {
      originalWordCount,
      chunkCount,
      averageChunkSize,
      processingTime
    }
  };
}

/**
 * Creates fixed-size chunks (fallback strategy)
 */
function createFixedSizeChunks(sentences: Sentence[], maxWords: number): SemanticChunk[] {
  const chunks: SemanticChunk[] = [];
  let currentChunk: Sentence[] = [];
  let currentWordCount = 0;
  
  sentences.forEach(sentence => {
    if (currentWordCount + sentence.wordCount > maxWords && currentChunk.length > 0) {
      const chunk = createChunkFromSentences(currentChunk, 'general');
      chunks.push(chunk);
      
      currentChunk = [sentence];
      currentWordCount = sentence.wordCount;
    } else {
      currentChunk.push(sentence);
      currentWordCount += sentence.wordCount;
    }
  });
  
  if (currentChunk.length > 0) {
    const chunk = createChunkFromSentences(currentChunk, 'general');
    chunks.push(chunk);
  }
  
  return chunks;
}

/**
 * Creates hybrid chunks (combines semantic and fixed-size)
 */
function createHybridChunks(sentences: Sentence[], options?: {maxChunkSize?: number, minChunkSize?: number}): SemanticChunk[] {
  // First create semantic chunks
  const semanticChunks = createSemanticChunks(sentences);
  
  // Then ensure they meet size requirements
  const maxSize = options?.maxChunkSize || 300;
  const minSize = options?.minChunkSize || 100;
  
  const adjustedChunks: SemanticChunk[] = [];
  
  semanticChunks.forEach(chunk => {
    if (chunk.wordCount > maxSize) {
      // Split large chunks
      const subChunks = splitLargeChunk(chunk, maxSize);
      adjustedChunks.push(...subChunks);
    } else if (chunk.wordCount < minSize && adjustedChunks.length > 0) {
      // Merge small chunks with previous
      const lastChunk = adjustedChunks[adjustedChunks.length - 1];
      const merged = mergeChunks(lastChunk, chunk);
      adjustedChunks[adjustedChunks.length - 1] = merged;
    } else {
      adjustedChunks.push(chunk);
    }
  });
  
  return adjustedChunks;
}

/**
 * Splits a large chunk into smaller ones
 */
function splitLargeChunk(chunk: SemanticChunk, maxWords: number): SemanticChunk[] {
  const subChunks: SemanticChunk[] = [];
  let currentChunk: Sentence[] = [];
  let currentWordCount = 0;
  
  chunk.sentences.forEach(sentence => {
    if (currentWordCount + sentence.wordCount > maxWords && currentChunk.length > 0) {
      const subChunk = createChunkFromSentences(currentChunk, chunk.topic);
      subChunks.push(subChunk);
      
      currentChunk = [sentence];
      currentWordCount = sentence.wordCount;
    } else {
      currentChunk.push(sentence);
      currentWordCount += sentence.wordCount;
    }
  });
  
  if (currentChunk.length > 0) {
    const subChunk = createChunkFromSentences(currentChunk, chunk.topic);
    subChunks.push(subChunk);
  }
  
  return subChunks;
} 