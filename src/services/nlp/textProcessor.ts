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
      
      // Cargar el modelo para preguntas y respuestas
      this.questionAnsweringPipeline = await loadModel();
      
      // Hacer scraping de las páginas
      const pages = await scraper.scrapeAll();
      
      if (pages.size === 0) {
        throw new Error("No se pudo obtener contenido del sitio web");
      }

      // Procesar las páginas obtenidas
      this.processedPages = Array.from(pages.entries()).map(([url, page]) => ({
        url,
        title: page.title,
        content: cleanContent(page.content),
        relevanceScore: 0
      }));

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
      // Calcular relevancia de cada página
      this.processedPages.forEach(page => {
        page.relevanceScore = calculateRelevance(question, page);
      });

      // Ordenar las páginas por relevancia y seleccionar las más importantes
      const relevantPages = [...this.processedPages]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);

      if (relevantPages.length === 0) {
        return "Lo siento, no encontré información específica sobre tu pregunta. ¿Podrías reformularla?";
      }

      // Construir el contexto para el modelo
      const context = relevantPages
        .map(page => `${page.title}\n${page.content}`)
        .join("\n\n");

      // Usar el modelo para obtener una respuesta
      const result = await this.questionAnsweringPipeline({
        question: normalizeQuestion(question),
        context: context
      });

      if (!result.answer) {
        return "No pude encontrar una respuesta específica. ¿Podrías ser más específico con tu pregunta?";
      }

      // Formatear la respuesta
      let response = result.answer;
      
      // Agregar fuentes relevantes
      const sources = relevantPages
        .map(page => `- ${page.title}: ${page.url}`)
        .join('\n');
      
      response += `\n\nFuentes consultadas:\n${sources}`;

      return response;
    } catch (error) {
      console.error('Error processing question:', error);
      return "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo.";
    }
  }
}