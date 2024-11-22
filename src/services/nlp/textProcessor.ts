import { Pipeline, pipeline } from '@xenova/transformers';
import { ScrapedPage } from '../scraper/types';
import { scraper } from '../scraper/scraper';

interface ProcessedContent {
  url: string;
  title: string;
  content: string;
  relevanceScore: number;
}

export class TextProcessor {
  private static processedPages: ProcessedContent[] = [];
  private static initialized = false;
  private static questionAnsweringPipeline: any;

  static async initialize() {
    if (this.initialized) return;

    try {
      // Inicializar el modelo de question-answering
      this.questionAnsweringPipeline = await pipeline('question-answering', 'Xenova/bert-base-multilingual-cased');
      
      // Obtener y procesar el contenido
      const pages = await scraper.scrapeAll();
      pages.forEach((page, url) => {
        this.processedPages.push({
          url,
          title: page.title,
          content: page.content.toLowerCase(),
          relevanceScore: 0
        });
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing TextProcessor:', error);
      throw error;
    }
  }

  static async processQuestion(question: string): Promise<string> {
    await this.initialize();

    // Calcular relevancia usando coincidencia de palabras clave
    const questionWords = question.toLowerCase().split(/\s+/);
    
    this.processedPages.forEach(page => {
      let score = 0;
      questionWords.forEach(word => {
        if (page.content.includes(word)) {
          score += 1;
        }
      });
      page.relevanceScore = score;
    });

    // Ordenar por relevancia y tomar los más relevantes
    const relevantPages = [...this.processedPages]
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    if (relevantPages.length === 0) {
      return "Lo siento, no encontré información relevante sobre tu pregunta. ¿Podrías reformularla?";
    }

    // Usar el modelo de question-answering para obtener la respuesta
    try {
      const context = relevantPages.map(page => `${page.title}: ${page.content}`).join("\n\n");
      const result = await this.questionAnsweringPipeline({
        question,
        context
      });

      let response = result.answer;
      
      // Agregar fuentes de información
      response += "\n\nPuedes encontrar más información en:";
      relevantPages.forEach(page => {
        response += `\n- <a href="${page.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">${page.title}</a>`;
      });

      return response;
    } catch (error) {
      console.error('Error processing question:', error);
      return "Lo siento, hubo un error al procesar tu pregunta. ¿Podrías intentarlo de nuevo?";
    }
  }
}