import { Pipeline, pipeline } from '@xenova/transformers';
import { ScrapedPage } from '../scraper/types';
import { scraper } from '../scraper/scraper';
import * as pdfjsLib from 'pdfjs-dist';
import stringSimilarity from 'string-similarity';
import { toast } from 'sonner';

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
      console.log('Initializing TextProcessor...');
      
      // Initialize PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      // Initialize the pipeline with a lighter model
      this.questionAnsweringPipeline = await pipeline(
        'question-answering',
        'Xenova/distilbert-base-multilingual-cased',
        {
          progress_callback: (progress: any) => {
            console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
            if (progress.progress < 1) {
              toast.loading(`Cargando modelo de IA: ${Math.round(progress.progress * 100)}%`);
            } else {
              toast.dismiss();
            }
          }
        }
      ) as CustomPipeline;
      
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
          content: this.cleanContent(page.content || ''),
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
      'servicio social': ['servicio', 'social', 'ss', 'servicio_social'],
      'practicas profesionales': ['practicas', 'profesionales', 'pp', 'practicas_profesionales'],
      'electivas': ['electivas', 'optativas', 'materias optativas', 'materias_optativas'],
      'malla curricular': ['malla', 'curricular', 'plan de estudios', 'materias', 'plan_de_estudios'],
      'tramites': ['tramite', 'tramites', 'proceso', 'requisitos', 'documentos'],
      'liberacion': ['liberar', 'liberacion', 'libero', 'acreditar', 'terminar'],
      'informatica': ['informatica', 'sistemas', 'computacion', 'software'],
      'industrial': ['industrial', 'industrias', 'manufactura'],
      'transporte': ['transporte', 'transportes', 'logistica'],
      'metalurgia': ['metalurgia', 'metales', 'metalurgica'],
      'energia': ['energia', 'energias', 'energetica']
    };

    let normalizedQuestion = question.toLowerCase();
    
    Object.entries(keywords).forEach(([key, synonyms]) => {
      synonyms.forEach(synonym => {
        const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
        normalizedQuestion = normalizedQuestion.replace(regex, key);
      });
    });

    return normalizedQuestion;
  }

  private static calculateRelevance(question: string, content: ProcessedContent): number {
    const normalizedQuestion = this.normalizeQuestion(question);
    const normalizedContent = this.cleanContent(content.content);
    
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
    
    // Content length penalty (to avoid very short responses)
    if (content.content.length < 100) {
      score *= 0.5;
    }
    
    return score;
  }

  static async processQuestion(question: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      console.log('Processing question:', question);
      
      if (this.processedPages.length === 0) {
        throw new Error('No hay contenido disponible para procesar la pregunta');
      }

      // Calculate relevance scores
      this.processedPages.forEach(page => {
        page.relevanceScore = this.calculateRelevance(question, page);
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
        question: this.normalizeQuestion(question),
        context: context,
        max_answer_length: 200
      });

      let response = result.answer;
      
      // Enhance short answers with more context
      if (response.length < 50) {
        response = relevantPages[0].content.slice(0, 300) + "...\n\n" + response;
      }

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