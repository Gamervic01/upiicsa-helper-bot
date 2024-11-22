import { Pipeline, pipeline } from '@xenova/transformers';
import { ScrapedPage } from '../scraper/types';
import { scraper } from '../scraper/scraper';
import * as pdfjsLib from 'pdfjs-dist';

interface ProcessedContent {
  url: string;
  title: string;
  content: string;
  relevanceScore: number;
}

type CustomPipeline = Pipeline & {
  processor?: any;
};

export class TextProcessor {
  private static processedPages: ProcessedContent[] = [];
  private static initialized = false;
  private static questionAnsweringPipeline: CustomPipeline;

  static async initialize() {
    if (this.initialized) return;

    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      this.questionAnsweringPipeline = await pipeline('question-answering', 'Xenova/bert-base-multilingual-cased') as CustomPipeline;
      
      const pages = await scraper.scrapeAll();
      pages.forEach((page, url) => {
        this.processedPages.push({
          url,
          title: page.title,
          content: this.cleanContent(page.content),
          relevanceScore: 0
        });
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing TextProcessor:', error);
      throw error;
    }
  }

  private static cleanContent(content: string): string {
    return content
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static calculateRelevance(question: string, content: string): number {
    const questionWords = question.toLowerCase().split(/\s+/);
    const contentWords = new Set(content.toLowerCase().split(/\s+/));
    
    let score = 0;
    questionWords.forEach(word => {
      if (contentWords.has(word)) score += 1;
      if (content.includes(word)) score += 0.5;
    });
    
    const topics = {
      'servicio social': 2,
      'electivas': 2,
      'materias optativas': 2,
      'tramites': 1.5,
      'requisitos': 1.5
    };

    Object.entries(topics).forEach(([topic, points]) => {
      if (content.includes(topic)) score += points;
    });

    return score;
  }

  static async processQuestion(question: string): Promise<string> {
    await this.initialize();

    this.processedPages.forEach(page => {
      page.relevanceScore = this.calculateRelevance(question, page.content);
    });

    const relevantPages = [...this.processedPages]
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    if (relevantPages.length === 0 || relevantPages[0].relevanceScore < 1) {
      return "Lo siento, no encontré información relevante sobre tu pregunta en el sitio de UPIICSA. ¿Podrías reformularla o ser más específico?";
    }

    try {
      const context = relevantPages
        .map(page => `${page.title}: ${page.content}`)
        .join("\n\n");

      const result = await this.questionAnsweringPipeline({
        question,
        context
      });

      let response = result.answer;
      
      response += "\n\nFuentes consultadas:";
      relevantPages.forEach(page => {
        response += `\n- <a href="${page.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">${page.title}</a>`;
      });

      return response;
    } catch (error) {
      console.error('Error processing question:', error);
      return "Disculpa, hubo un error al procesar tu pregunta. Por favor, intenta reformularla.";
    }
  }
}