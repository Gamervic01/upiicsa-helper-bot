import { ScrapedPage } from '../scraper/types';
import { scraper } from '../scraper/scraper';
import { toast } from 'sonner';
import { loadModel } from './modelLoader';
import { calculateRelevance, cleanContent } from './contentProcessor';
import { normalizeQuestion } from './questionNormalizer';
import type { ProcessedContent } from './types';
import type { CustomPipeline } from './modelLoader';

export class TextProcessor {
  private static processedPages: ProcessedContent[] = [];
  private static initialized = false;
  private static questionAnsweringPipeline: CustomPipeline;

  static async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing TextProcessor...');
      
      // Load the simple model
      this.questionAnsweringPipeline = await loadModel();
      
      // Start scraping
      console.log('Starting web scraping...');
      const pages = await scraper.scrapeAll();
      
      if (!pages || pages.size === 0) {
        throw new Error('No se pudo obtener contenido del sitio web');
      }

      // Process pages
      pages.forEach((page, url) => {
        this.processedPages.push({
          url,
          title: page.title || url,
          content: cleanContent(page.content || ''),
          relevanceScore: 0
        });
      });

      console.log(`Processed ${this.processedPages.length} pages successfully`);
      this.initialized = true;
      toast.success('Sistema inicializado correctamente');
    } catch (error) {
      console.error('Error initializing TextProcessor:', error);
      toast.error('Error al inicializar el sistema de procesamiento');
      throw error;
    }
  }

  static async processQuestion(question: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      if (this.processedPages.length === 0) {
        throw new Error('No hay contenido disponible para procesar la pregunta');
      }

      // Calculate relevance scores
      this.processedPages.forEach(page => {
        page.relevanceScore = calculateRelevance(question, page);
      });

      // Sort by relevance and get top results
      const relevantPages = [...this.processedPages]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);

      if (relevantPages[0].relevanceScore < 1) {
        return "Lo siento, no encontré información específica sobre tu pregunta. ¿Podrías reformularla o ser más específico?";
      }

      // Prepare context from relevant pages
      const context = relevantPages
        .map(page => `${page.title}: ${page.content}`)
        .join("\n\n");

      // Get answer using the pipeline
      const result = await this.questionAnsweringPipeline({
        question: normalizeQuestion(question),
        context: context
      });

      let response = result.answer;
      
      // Add sources
      response += "\n\nFuentes consultadas:";
      relevantPages.forEach(page => {
        response += `\n- <a href="${page.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">${page.title}</a>`;
      });

      return response;
    } catch (error) {
      console.error('Error processing question:', error);
      throw error;
    }
  }
}