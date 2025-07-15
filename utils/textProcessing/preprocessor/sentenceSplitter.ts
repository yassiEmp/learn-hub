// ============================================================================
// Smart Sentence Splitter
// ============================================================================

import { Sentence } from '../types';

/**
 * Smart sentence splitting that considers context and meaning
 */
export function splitIntoSentences(text: string): Sentence[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const sentences: Sentence[] = [];
  // Split on periods, exclamation marks, question marks, semicolons, or colons
  const rawSentences = text.split(/(?<=[.!?;:])\s+/).filter(Boolean);
  
  rawSentences.forEach((sentenceText, index) => {
    const cleaned = sentenceText.trim();
    if (cleaned.length < 3) return; // Skip very short sentences
    
    const sentence: Sentence = {
      id: `sentence_${index}`,
      text: cleaned,
      index,
      importance: calculateSentenceImportance(cleaned),
      wordCount: cleaned.split(/\s+/).length,
      complexity: analyzeSentenceComplexity(cleaned),
      topic: detectSentenceTopic(cleaned),
      context: extractSentenceContext(cleaned, index, rawSentences)
    };
    
    sentences.push(sentence);
  });

  return sentences;
}

/**
 * Calculates importance score for a sentence
 */
function calculateSentenceImportance(sentence: string): number {
  let score = 0;
  
  // Keywords that indicate importance
  const importantKeywords = [
    'important', 'key', 'essential', 'critical', 'crucial', 'vital',
    'main', 'primary', 'fundamental', 'core', 'central', 'significant',
    'definition', 'concept', 'principle', 'theory', 'method', 'approach',
    'example', 'demonstration', 'proof', 'evidence', 'result', 'conclusion'
  ];
  
  const lowerSentence = sentence.toLowerCase();
  
  // Check for important keywords
  importantKeywords.forEach(keyword => {
    if (lowerSentence.includes(keyword)) {
      score += 2;
    }
  });
  
  // Check for definitions (X is Y patterns)
  if (/\b\w+\s+(is|are|means|refers to|defined as)\s+/.test(lowerSentence)) {
    score += 3;
  }
  
  // Check for examples
  if (/\b(for example|such as|like|including|e\.g\.|i\.e\.)\b/i.test(sentence)) {
    score += 1;
  }
  
  // Check for conclusions
  if (/\b(therefore|thus|consequently|as a result|in conclusion|finally)\b/i.test(sentence)) {
    score += 2;
  }
  
  // Check for questions (often indicate important concepts)
  if (sentence.includes('?')) {
    score += 1;
  }
  
  // Normalize score
  return Math.min(10, Math.max(1, score));
}

/**
 * Analyzes sentence complexity
 */
function analyzeSentenceComplexity(sentence: string): 'simple' | 'moderate' | 'complex' {
  const words = sentence.split(/\s+/);
  const wordCount = words.length;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  
  // Count complex structures
  const complexPatterns = [
    /\b(although|however|nevertheless|furthermore|moreover|additionally)\b/gi,
    /\b(consequently|therefore|thus|hence|as a result)\b/gi,
    /\b(despite|in spite of|regardless of|notwithstanding)\b/gi,
    /[,;:]\s+[a-z]/gi, // Multiple clauses
    /\b(if|when|while|since|because|although)\b/gi // Subordinate clauses
  ];
  
  let complexScore = 0;
  complexPatterns.forEach(pattern => {
    complexScore += (sentence.match(pattern) || []).length;
  });
  
  if (wordCount > 25 || avgWordLength > 6 || complexScore > 3) {
    return 'complex';
  } else if (wordCount > 15 || avgWordLength > 5 || complexScore > 1) {
    return 'moderate';
  } else {
    return 'simple';
  }
}

/**
 * Detects the topic of a sentence
 */
function detectSentenceTopic(sentence: string): string {
  const lowerSentence = sentence.toLowerCase();
  
  // Topic detection patterns
  const topicPatterns = [
    { pattern: /\b(programming|coding|development|software|web|mobile)\b/gi, topic: 'programming' },
    { pattern: /\b(mathematics|algebra|calculus|geometry|statistics)\b/gi, topic: 'mathematics' },
    { pattern: /\b(science|physics|chemistry|biology|engineering)\b/gi, topic: 'science' },
    { pattern: /\b(business|marketing|finance|economics|management)\b/gi, topic: 'business' },
    { pattern: /\b(design|art|creativity|visual|graphic)\b/gi, topic: 'design' },
    { pattern: /\b(language|grammar|vocabulary|writing|communication)\b/gi, topic: 'language' },
    { pattern: /\b(history|culture|society|politics|philosophy)\b/gi, topic: 'humanities' },
    { pattern: /\b(health|medicine|nutrition|fitness|wellness)\b/gi, topic: 'health' }
  ];
  
  for (const { pattern, topic } of topicPatterns) {
    if (pattern.test(lowerSentence)) {
      return topic;
    }
  }
  
  return 'general';
}

/**
 * Extracts context from surrounding sentences
 */
function extractSentenceContext(
  sentence: string, 
  index: number, 
  allSentences: string[]
): string {
  const context: string[] = [];
  
  // Add previous sentence if available
  if (index > 0) {
    const prevSentence = allSentences[index - 1];
    if (prevSentence.length > 10) {
      context.push(`Previous: ${prevSentence.substring(0, 50)}...`);
    }
  }
  
  // Add next sentence if available
  if (index < allSentences.length - 1) {
    const nextSentence = allSentences[index + 1];
    if (nextSentence.length > 10) {
      context.push(`Next: ${nextSentence.substring(0, 50)}...`);
    }
  }
  
  return context.join(' | ');
}

/**
 * Filters sentences based on quality criteria
 */
export function filterSentences(sentences: Sentence[]): Sentence[] {
  return sentences.filter(sentence => {
    // Remove very short sentences
    if (sentence.wordCount < 3) return false;
    
    // Remove sentences that are just punctuation or formatting
    if (/^[^\w]*$/.test(sentence.text)) return false;
    
    // Remove sentences that are just numbers or symbols
    if (/^[\d\s\-_.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]*$/.test(sentence.text)) return false;
    
    // Remove sentences that are too long (likely run-ons)
    if (sentence.wordCount > 80) return false;
    
    return true;
  });
}

/**
 * Groups sentences by topic similarity
 */
export function groupSentencesByTopic(sentences: Sentence[]): Map<string, Sentence[]> {
  const groups = new Map<string, Sentence[]>();
  
  sentences.forEach(sentence => {
    const topic = sentence.topic || 'general';
    if (!groups.has(topic)) {
      groups.set(topic, []);
    }
    groups.get(topic)!.push(sentence);
  });
  
  return groups;
}

/**
 * Sorts sentences by importance
 */
export function sortSentencesByImportance(sentences: Sentence[]): Sentence[] {
  return [...sentences].sort((a, b) => b.importance - a.importance);
}

/**
 * Creates sentence clusters based on semantic similarity
 */
export function createSentenceClusters(sentences: Sentence[]): Sentence[][] {
  const clusters: Sentence[][] = [];
  const used = new Set<string>();
  
  sentences.forEach(sentence => {
    if (used.has(sentence.id)) return;
    
    const cluster = [sentence];
    used.add(sentence.id);
    
    // Find similar sentences
    sentences.forEach(otherSentence => {
      if (used.has(otherSentence.id)) return;
      
      if (areSentencesSimilar(sentence, otherSentence)) {
        cluster.push(otherSentence);
        used.add(otherSentence.id);
      }
    });
    
    clusters.push(cluster);
  });
  
  return clusters;
}

/**
 * Checks if two sentences are semantically similar
 */
function areSentencesSimilar(sentence1: Sentence, sentence2: Sentence): boolean {
  // Same topic
  if (sentence1.topic === sentence2.topic && sentence1.topic !== 'general') {
    return true;
  }
  
  // Similar complexity
  if (sentence1.complexity === sentence2.complexity) {
    return true;
  }
  
  // Similar importance level
  const importanceDiff = Math.abs(sentence1.importance - sentence2.importance);
  if (importanceDiff <= 2) {
    return true;
  }
  
  // Shared keywords (simplified)
  const words1 = new Set(sentence1.text.toLowerCase().match(/\b\w{4,}\b/g) || []);
  const words2 = new Set(sentence2.text.toLowerCase().match(/\b\w{4,}\b/g) || []);
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  
  return intersection.size >= 2;
} 