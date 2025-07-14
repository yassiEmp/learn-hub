// ============================================================================
// Text Cleaning Utilities
// ============================================================================

import { ContentAnalysis } from '../types';

/**
 * Cleans and normalizes raw text for processing while preserving important information
 */
export function cleanText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    // Preserve important patterns (numbers, dates, etc.)
    .replace(/(\d+\.\d+)/g, '$1') // Preserve decimal numbers
    .replace(/(\d+%)/g, '$1') // Preserve percentages
    .replace(/(\$\d+)/g, '$1') // Preserve currency
    .replace(/(\d+:\d+)/g, '$1') // Preserve time formats
    .replace(/(\d{1,2}\/\d{1,2}\/\d{2,4})/g, '$1') // Preserve dates
    .replace(/(\d{3}-\d{3}-\d{4})/g, '$1') // Preserve phone numbers
    .replace(/(\d{5}(-\d{4})?)/g, '$1') // Preserve ZIP codes
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Normalize quotes (preserve meaning)
    .replace(/["""'']/g, '"')
    // Normalize dashes (preserve meaning)
    .replace(/[–—]/g, '-')
    // Normalize ellipsis (preserve meaning)
    .replace(/\.{3,}/g, '...')
    // Normalize multiple punctuation (preserve meaning)
    .replace(/[!?]{2,}/g, (match) => match[0])
    // Remove only truly problematic characters that don't add meaning
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width spaces
    // Trim whitespace
    .trim();
}

/**
 * Removes common noise patterns from text while preserving important information
 */
export function removeNoise(text: string): string {
  return text
    // Convert formatting to normal text (preserve content)
    .replace(/^\s*[-*+]\s*/gm, '') // Bullet points at start of lines
    .replace(/^\s*\d+\.\s*/gm, '') // Numbered lists
    .replace(/^\s*#+\s*/gm, '') // Markdown headers
    .replace(/^\s*>\s*/gm, '') // Blockquotes
    .replace(/^\s*`{3,}.*$/gm, '') // Empty code blocks
    .replace(/^\s*`([^`]+)`\s*$/gm, '$1') // Inline code (extract content)
    .replace(/^\s*\[([^\]]+)\]\([^)]+\)\s*$/gm, '$1') // Markdown links (extract text)
    .replace(/^\s*!\[([^\]]+)\]\([^)]+\)\s*$/gm, '$1') // Markdown images (extract alt text)
    // Remove excessive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Clean up
    .trim();
}



/**
 * Extracts and preserves important information from text
 */
export function extractImportantInfo(text: string): {
  emails: string[];
  urls: string[];
  phoneNumbers: string[];
  dates: string[];
  numbers: string[];
  cleanedText: string;
} {
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  const phoneNumbers = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g) || [];
  const dates = text.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g) || [];
  const numbers = text.match(/\b\d+(?:\.\d+)?(?:%|\$)?\b/g) || [];

  // Remove URLs and emails from text but keep other important info
  const cleanedText = text
    .replace(/https?:\/\/[^\s]+/g, '[URL]')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');

  return {
    emails,
    urls,
    phoneNumbers,
    dates,
    numbers,
    cleanedText
  };
}

/**
 * Detects and removes duplicate content
 */
export function removeDuplicates(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const uniqueSentences = new Set<string>();
  const cleanedSentences: string[] = [];

  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase();
    if (!uniqueSentences.has(normalized)) {
      uniqueSentences.add(normalized);
      cleanedSentences.push(sentence.trim());
    }
  }

  return cleanedSentences.join('. ') + (text.endsWith('.') ? '.' : '');
}

/**
 * Analyzes text complexity and characteristics
 */
export function analyzeTextComplexity(text: string): {
  complexity: 'simple' | 'moderate' | 'complex';
  readabilityScore: number;
  averageSentenceLength: number;
  averageWordLength: number;
  uniqueWordRatio: number;
} {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);

  const averageSentenceLength = words.length / Math.max(sentences.length, 1);
  const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / Math.max(words.length, 1);
  const uniqueWordRatio = uniqueWords.size / Math.max(words.length, 1);

  // Calculate Flesch Reading Ease score (simplified)
  // TODO: use a more accurate flesch reading ease score
  const fleschScore = 206.835 - (1.015 * averageSentenceLength) - (84.6 * averageWordLength);
  
  let complexity: 'simple' | 'moderate' | 'complex';
  if (fleschScore >= 60) {
    complexity = 'simple';
  } else if (fleschScore >= 30) {
    complexity = 'moderate';
  } else {
    complexity = 'complex';
  }

  return {
    complexity,
    readabilityScore: Math.max(0, Math.min(100, fleschScore)),
    averageSentenceLength,
    averageWordLength,
    uniqueWordRatio
  };
}

/**
 * Detects the primary language of the text
 */
export function detectLanguage(text: string): string {
  // Simple language detection based on common words
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const frenchWords = ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec'];
  const spanishWords = ['el', 'la', 'los', 'las', 'y', 'o', 'pero', 'en', 'sobre', 'a', 'para', 'de'];

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  let englishCount = 0;
  let frenchCount = 0;
  let spanishCount = 0;

  for (const word of words) {
    if (englishWords.includes(word)) englishCount++;
    if (frenchWords.includes(word)) frenchCount++;
    if (spanishWords.includes(word)) spanishCount++;
  }

  if (frenchCount > englishCount && frenchCount > spanishCount) return 'fr';
  if (spanishCount > englishCount && spanishCount > frenchCount) return 'es';
  return 'en'; // Default to English
}

/**
 * Detects the content type based on patterns
 */
export function detectContentType(text: string): 'technical' | 'educational' | 'narrative' | 'mixed' {
  const technicalPatterns = [
    /\b(api|function|class|method|variable|parameter|interface|database|server|client)\b/gi,
    /\b(algorithm|data structure|framework|library|dependency|package)\b/gi,
    /\b(error|exception|debug|test|deploy|build|compile)\b/gi
  ];

  const educationalPatterns = [
    /\b(learn|understand|explain|demonstrate|example|practice|exercise)\b/gi,
    /\b(concept|principle|theory|method|approach|strategy)\b/gi,
    /\b(step|process|procedure|guide|tutorial|lesson)\b/gi
  ];

  const narrativePatterns = [
    /\b(story|narrative|experience|journey|adventure|discovery)\b/gi,
    /\b(feel|think|believe|imagine|remember|realize)\b/gi,
    /\b(character|plot|setting|theme|conflict|resolution)\b/gi
  ];

  let technicalScore = 0;
  let educationalScore = 0;
  let narrativeScore = 0;

  technicalPatterns.forEach(pattern => {
    technicalScore += (text.match(pattern) || []).length;
  });

  educationalPatterns.forEach(pattern => {
    educationalScore += (text.match(pattern) || []).length;
  });

  narrativePatterns.forEach(pattern => {
    narrativeScore += (text.match(pattern) || []).length;
  });

  const maxScore = Math.max(technicalScore, educationalScore, narrativeScore);
  
  if (maxScore === 0) return 'mixed';
  if (technicalScore === maxScore) return 'technical';
  if (educationalScore === maxScore) return 'educational';
  if (narrativeScore === maxScore) return 'narrative';
  
  return 'mixed';
}

/**
 * Extracts key topics from text
 */
export function extractTopics(text: string): string[] {
  const topics: string[] = [];
  
  // Common educational topics
  const topicPatterns = [
    /\b(programming|coding|development|software|web|mobile|frontend|backend)\b/gi,
    /\b(mathematics|algebra|calculus|geometry|statistics|probability)\b/gi,
    /\b(science|physics|chemistry|biology|engineering|technology)\b/gi,
    /\b(business|marketing|finance|economics|management|leadership)\b/gi,
    /\b(design|art|creativity|visual|graphic|user experience)\b/gi,
    /\b(language|grammar|vocabulary|writing|reading|communication)\b/gi
  ];

  topicPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      topics.push(...matches.map(match => match.toLowerCase()));
    }
  });

  return [...new Set(topics)]; // Remove duplicates
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.match(/\b\w+\b/g) || [];
  return Math.ceil(words.length / wordsPerMinute);
}

/**
 * Comprehensive text analysis
 */
export function analyzeContent(text: string): ContentAnalysis {
  const cleanedText = cleanText(text);
  const complexity = analyzeTextComplexity(cleanedText);
  const language = detectLanguage(cleanedText);
  const type = detectContentType(cleanedText);
  const topics = extractTopics(cleanedText);
  const readingTime = estimateReadingTime(cleanedText);

  // Extract keywords (simplified)
  const words = cleanedText.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 3) { // Skip short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const keywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  return {
    language,
    type,
    complexity: complexity.complexity,
    topics,
    keywords,
    estimatedReadingTime: readingTime,
    readabilityScore: complexity.readabilityScore
  };
}

/**
 * Complete text preprocessing pipeline
 */
export function preprocessText(text: string): {
  cleaned: string;
  analysis: ContentAnalysis;
  metadata: {
    originalLength: number;
    cleanedLength: number;
    removedNoise: boolean;
    removedDuplicates: boolean;
    importantInfo: {
      emails: string[];
      urls: string[];
      phoneNumbers: string[];
      dates: string[];
      numbers: string[];
    };
  };
} {
  const originalLength = text.length;
  
  // Extract important information first
  const importantInfo = extractImportantInfo(text);
  
  // Clean the text
  let cleaned = cleanText(text);
  const cleanedLength = cleaned.length;
  
  // Remove noise while preserving content
  const beforeNoise = cleaned.length;
  cleaned = removeNoise(cleaned);
  const removedNoise = beforeNoise !== cleaned.length;
  
  // Remove duplicates
  const beforeDuplicates = cleaned.length;
  cleaned = removeDuplicates(cleaned);
  const removedDuplicates = beforeDuplicates !== cleaned.length;
  
  // Analyze content
  const analysis = analyzeContent(cleaned);

  return {
    cleaned,
    analysis,
    metadata: {
      originalLength,
      cleanedLength,
      removedNoise,
      removedDuplicates,
      importantInfo: {
        emails: importantInfo.emails,
        urls: importantInfo.urls,
        phoneNumbers: importantInfo.phoneNumbers,
        dates: importantInfo.dates,
        numbers: importantInfo.numbers
      }
    }
  };
} 