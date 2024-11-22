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
      
      // Cargar el modelo
      this.questionAnsweringPipeline = await loadModel();
      
      // Obtener datos estáticos
      const pages = await scraper.scrapeAll();
      
      // Procesar páginas
      pages.forEach((page, url) => {
        this.processedPages.push({
          url,
          title: page.title,
          content: cleanContent(page.content),
          relevanceScore: 0
        });
      });

      console.log(`Processed ${this.processedPages.length} pages successfully`);
      this.initialized = true;
      toast.success('Sistema inicializado correctamente');
    } catch (error) {
      console.error('Error initializing TextProcessor:', error);
      toast.error('Error al inicializar el sistema');
      throw error;
    }
  }

  static async processQuestion(question: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Calcular relevancia
      this.processedPages.forEach(page => {
        page.relevanceScore = calculateRelevance(question, page);
      });

      // Ordenar por relevancia y obtener los mejores resultados
      const relevantPages = [...this.processedPages]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);

      if (relevantPages.length === 0) {
        return "Lo siento, no encontré información específica sobre tu pregunta. ¿Podrías reformularla?";
      }

      // Preparar contexto
      const context = relevantPages
        .map(page => `${page.title}: ${page.content}`)
        .join("\n\n");

      // Obtener respuesta usando el pipeline
      const result = await this.questionAnsweringPipeline({
        question: normalizeQuestion(question),
        context: context
      });

      return result.answer;
    } catch (error) {
      console.error('Error processing question:', error);
      throw error;
    }
  }
}