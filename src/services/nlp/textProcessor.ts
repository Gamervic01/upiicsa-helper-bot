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

  // Inicializa el sistema
  static async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing TextProcessor...');
      
      // Cargar el modelo para preguntas y respuestas
      this.questionAnsweringPipeline = await loadModel();
      
      // Hacer scraping de las páginas
      const pages = await scraper.scrapeAll();
      
      if (pages.size === 0) {
        throw new Error("No se obtuvieron páginas del scraper.");
      }

      // Procesar las páginas obtenidas
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

  // Procesar preguntas del usuario
  static async processQuestion(question: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      console.log(`Processing question: "${question}"`);

      // Calcular relevancia de cada página
      this.processedPages.forEach(page => {
        page.relevanceScore = calculateRelevance(question, page);
      });

      // Ordenar las páginas por relevancia y seleccionar las más importantes
      const relevantPages = [...this.processedPages]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);

      if (relevantPages.length === 0 || relevantPages.every(page => page.relevanceScore === 0)) {
        return "Lo siento, no encontré información específica sobre tu pregunta. ¿Podrías intentar con otra formulación?";
      }

      console.log('Relevant pages selected:', relevantPages.map(page => page.title));

      // Construir el contexto para el modelo
      const context = relevantPages
        .map(page => `${page.title}: ${page.content}`)
        .join("\n\n");

      // Usar el modelo para obtener una respuesta
      const result = await this.questionAnsweringPipeline({
        question: normalizeQuestion(question),
        context: context
      });

      if (!result || !result.answer) {
        console.warn("El modelo no generó una respuesta adecuada.");
        return "Lo siento, no pude generar una respuesta basada en la información disponible.";
      }

      return result.answer;
    } catch (error) {
      console.error('Error processing question:', error);
      return "Lo siento, ocurrió un error mientras procesaba tu pregunta. Por favor, intenta de nuevo.";
    }
  }
}
