import { Pipeline, pipeline } from '@xenova/transformers';
import { ScrapedPage } from '../scraper/types';
import { scraper } from '../scraper/scraper';
import * as pdfjsLib from 'pdfjs-dist';
import stringSimilarity from 'string-similarity';

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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static normalizeQuestion(question: string): string {
    const keywords: { [key: string]: string[] } = {
      'servicio social': ['servicio', 'social', 'ss'],
      'practicas profesionales': ['practicas', 'profesionales', 'pp'],
      'electivas': ['electivas', 'optativas', 'materias optativas'],
      'malla curricular': ['malla', 'curricular', 'plan de estudios', 'materias'],
      'tramites': ['tramite', 'tramites', 'proceso', 'requisitos'],
      'liberacion': ['liberar', 'liberacion', 'libero', 'acreditar']
    };

    let normalizedQuestion = question.toLowerCase();
    
    // Reemplazar sinónimos y variaciones
    Object.entries(keywords).forEach(([key, synonyms]) => {
      synonyms.forEach(synonym => {
        const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
        normalizedQuestion = normalizedQuestion.replace(regex, key);
      });
    });

    return normalizedQuestion;
  }

  private static calculateRelevance(question: string, content: string): number {
    const normalizedQuestion = this.normalizeQuestion(question);
    const normalizedContent = this.cleanContent(content);
    
    // Calcular similitud base usando string-similarity
    const similarity = stringSimilarity.compareTwoStrings(normalizedQuestion, normalizedContent);
    let score = similarity * 5; // Base score
    
    // Identificar palabras clave importantes
    const keywords = {
      'servicio social': 3,
      'practicas profesionales': 3,
      'electivas': 3,
      'malla curricular': 2.5,
      'tramites': 2,
      'liberacion': 2.5,
      'requisitos': 2,
      'proceso': 1.5,
      'informatica': 2,
      'sistemas': 2,
      'industrial': 2,
      'administracion': 2,
      'mecanica': 2
    };

    // Aumentar score basado en palabras clave encontradas
    Object.entries(keywords).forEach(([keyword, points]) => {
      if (normalizedContent.includes(keyword)) {
        score += points;
      }
      if (normalizedQuestion.includes(keyword)) {
        score += points * 0.5; // Bonus por coincidencia en la pregunta
      }
    });

    // Bonus por coincidencia de frases completas
    const phrases = normalizedQuestion.match(/"([^"]*)"|\b\w+\s+\w+\s+\w+\b|\b\w+\s+\w+\b|\b\w+\b/g) || [];
    phrases.forEach(phrase => {
      if (normalizedContent.includes(phrase)) {
        score += phrase.split(' ').length; // Más palabras = más puntos
      }
    });

    return score;
  }

  static async processQuestion(question: string): Promise<string> {
    await this.initialize();

    const normalizedQuestion = this.normalizeQuestion(question);
    
    this.processedPages.forEach(page => {
      page.relevanceScore = this.calculateRelevance(normalizedQuestion, page.content);
    });

    const relevantPages = [...this.processedPages]
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    if (relevantPages.length === 0 || relevantPages[0].relevanceScore < 2) {
      return "Lo siento, no encontré información específica sobre tu pregunta en el sitio de UPIICSA. ¿Podrías reformularla o ser más específico? Por ejemplo, si preguntas por trámites, especifica cuál trámite te interesa.";
    }

    try {
      const context = relevantPages
        .map(page => `${page.title}: ${page.content}`)
        .join("\n\n");

      const result = await this.questionAnsweringPipeline({
        question: normalizedQuestion,
        context
      });

      let response = result.answer;
      
      if (response.length < 50) {
        // Si la respuesta es muy corta, incluir más contexto
        response = relevantPages[0].content.slice(0, 300) + "...\n\n" + response;
      }

      response += "\n\nFuentes consultadas:";
      relevantPages.forEach(page => {
        response += `\n- <a href="${page.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">${page.title}</a>`;
      });

      return response;
    } catch (error) {
      console.error('Error processing question:', error);
      return "Disculpa, hubo un error al procesar tu pregunta. Por favor, intenta reformularla o pregunta algo más específico.";
    }
  }
}