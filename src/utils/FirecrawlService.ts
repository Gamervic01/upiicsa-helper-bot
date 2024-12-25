import FirecrawlApp from '@mendable/firecrawl-js';

interface CrawlResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class FirecrawlService {
  private static firecrawlApp: FirecrawlApp;

  static async initializeApp(apiKey: string) {
    this.firecrawlApp = new FirecrawlApp({ apiKey });
  }

  static async crawlUPIICSA(): Promise<CrawlResult> {
    try {
      console.log('Iniciando crawl de UPIICSA...');
      
      const response = await this.firecrawlApp.crawlUrl('https://www.upiicsa.ipn.mx/', {
        limit: 1000, // Crawl hasta 1000 páginas
        scrapeOptions: {
          formats: ['markdown', 'html'],
          includeSelectors: [
            'main',
            'article',
            '.content',
            'section',
            'h1',
            'h2',
            'h3',
            'p'
          ]
        }
      });

      if (!response.success) {
        throw new Error('Falló el crawl');
      }

      console.log('Crawl completado exitosamente');
      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Error durante el crawl:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido durante el crawl'
      };
    }
  }

  static processScrapedData(data: any) {
    // Aquí procesaremos los datos extraídos para generar el archivo chatData.ts
    // TODO: Implementar el procesamiento de datos
  }
}