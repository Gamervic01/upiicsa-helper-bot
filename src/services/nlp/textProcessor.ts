import natural from 'natural';
import { Pipeline, pipeline } from '@xenova/transformers';
import { ScrapedPage } from '../scraper/types';
import { scraper } from '../scraper/scraper';

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
let questionAnsweringPipeline: Pipeline;

interface ProcessedContent {
  url: string;
  title: string;
  tokens: string[];
  relevanceScore: number;
}

export class TextProcessor {
  private static tfidf = new TfIdf();
  private static processedPages: ProcessedContent[] = [];
  private static initialized = false;

  static async initialize() {
    if (this.initialized) return;

    try {
      // Inicializar el modelo de question-answering
      questionAnsweringPipeline = await pipeline('question-answering', 'Xenova/bert-base-multilingual-cased');
      
      // Obtener y procesar el contenido
      const pages = await scraper.scrapeAll();
      pages.forEach((page, url) => {
        const tokens = tokenizer.tokenize(page.content.toLowerCase());
        this.processedPages.push({
          url,
          title: page.title,
          tokens,
          relevanceScore: 0
        });
        this.tfidf.addDocument(tokens);
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing TextProcessor:', error);
      throw error;
    }
  }

  static async processQuestion(question: string): Promise<string> {
    await this.initialize();

    // Tokenizar la pregunta
    const questionTokens = tokenizer.tokenize(question.toLowerCase());
    
    // Calcular relevancia de cada documento
    this.processedPages.forEach((page, index) => {
      let score = 0;
      questionTokens.forEach(token => {
        score += this.tfidf.tfidf(token, index);
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
      const context = relevantPages.map(page => page.title + ": " + page.tokens.join(" ")).join("\n\n");
      const result = await questionAnsweringPipeline({
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