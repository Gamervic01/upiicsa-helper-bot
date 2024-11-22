import stringSimilarity from 'string-similarity';
import { ProcessedContent } from './types';

export const cleanContent = (content: string): string => {
  return content
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ' ')
    .trim();
};

export const calculateRelevance = (question: string, content: ProcessedContent): number => {
  const normalizedQuestion = question.toLowerCase();
  const normalizedContent = cleanContent(content.content);
  
  let score = 0;
  
  // Base similarity score
  const similarity = stringSimilarity.compareTwoStrings(normalizedQuestion, normalizedContent);
  score += similarity * 5;
  
  // URL relevance
  const urlKeywords = normalizedQuestion.split(' ');
  urlKeywords.forEach(keyword => {
    if (content.url.toLowerCase().includes(keyword)) {
      score += 2;
    }
  });
  
  // Title relevance
  const titleSimilarity = stringSimilarity.compareTwoStrings(normalizedQuestion, content.title.toLowerCase());
  score += titleSimilarity * 3;
  
  // Content length penalty
  if (content.content.length < 100) {
    score *= 0.5;
  }
  
  return score;
};