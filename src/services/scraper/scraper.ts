import { UPIICSA_BASE_URL, ALLOWED_DOMAINS, SCRAPING_RULES, SELECTORS } from './config';
import type { ScrapedPage, ScrapedLink, ScrapingResult } from './types';
import { toast } from 'sonner';

class UPIICSAScraper {
  private visitedUrls: Set<string> = new Set();
  private queue: string[] = [];
  private results: Map<string, ScrapedPage> = new Map();

  constructor() {
    this.queue.push(UPIICSA_BASE_URL);
  }

  private isAllowedUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ALLOWED_DOMAINS.some(domain => urlObj.hostname === domain) &&
             SCRAPING_RULES.includePatterns.some(pattern => pattern.test(url)) &&
             !SCRAPING_RULES.excludePatterns.some(pattern => pattern.test(url));
    } catch {
      return false;
    }
  }

  private normalizeUrl(url: string): string {
    try {
      if (url.startsWith('//')) {
        return `https:${url}`;
      }
      if (url.startsWith('/')) {
        return new URL(url, UPIICSA_BASE_URL).href;
      }
      return new URL(url, UPIICSA_BASE_URL).href;
    } catch {
      return url;
    }
  }

  private async scrapePage(url: string): Promise<ScrapingResult> {
    try {
      console.log(`Scraping: ${url}`);

      // Contenido estático de ejemplo para desarrollo
      const staticContent = {
        "servicio-social": {
          title: "Servicio Social UPIICSA",
          content: `El servicio social es una actividad obligatoria que deben realizar los estudiantes de UPIICSA. 
                   Requisitos principales:
                   - Tener el 70% de créditos aprobados
                   - Cubrir 480 horas en un período mínimo de 6 meses
                   - Realizar el registro en el SISS
                   Para más información, acude al Departamento de Servicio Social.`
        },
        "practicas-profesionales": {
          title: "Prácticas Profesionales",
          content: `Las prácticas profesionales son una oportunidad para adquirir experiencia laboral.
                   Requisitos:
                   - Ser alumno regular
                   - Tener el 70% de créditos
                   - Registrar tu práctica en el departamento correspondiente
                   Duración mínima: 240 horas.`
        },
        "titulacion": {
          title: "Opciones de Titulación",
          content: `UPIICSA ofrece diferentes opciones de titulación:
                   1. Tesis
                   2. Seminario
                   3. Escolaridad
                   4. Experiencia Profesional
                   5. Curricular
                   6. Proyecto de Investigación
                   Consulta los requisitos específicos en la Unidad de Titulación.`
        }
      };

      // Simular el contenido basado en la URL
      const urlPath = url.split('/').pop() || '';
      const pageContent = staticContent[urlPath as keyof typeof staticContent] || {
        title: "UPIICSA - IPN",
        content: `La Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas (UPIICSA) 
                 es una unidad académica del Instituto Politécnico Nacional (IPN).
                 Ofrecemos las siguientes carreras:
                 - Ingeniería en Informática
                 - Ingeniería Industrial
                 - Ingeniería en Transporte
                 - Ingeniería en Sistemas Automotrices
                 - Administración Industrial
                 Para más información, visita nuestras instalaciones o contacta a control escolar.`
      };

      const scrapedPage: ScrapedPage = {
        url,
        title: pageContent.title,
        content: pageContent.content,
        links: [],
        lastScraped: new Date()
      };

      this.results.set(url, scrapedPage);
      this.visitedUrls.add(url);

      return { success: true, data: scrapedPage };
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error durante el scraping'
      };
    }
  }

  public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
    try {
      console.log('Starting scraping process...');
      let processedCount = 0;
      const maxPages = SCRAPING_RULES.maxDepth * 10;

      // Procesar páginas principales
      const mainPages = [
        `${UPIICSA_BASE_URL}/servicio-social`,
        `${UPIICSA_BASE_URL}/practicas-profesionales`,
        `${UPIICSA_BASE_URL}/titulacion`
      ];

      for (const url of mainPages) {
        if (!this.visitedUrls.has(url)) {
          await this.scrapePage(url);
          processedCount++;
        }
      }

      console.log(`Scraping completed. Processed ${processedCount} pages.`);
      return this.results;
    } catch (error) {
      console.error('Error in scrapeAll:', error);
      toast.error('Error al obtener información del sitio web');
      throw error;
    }
  }

  public getResults(): Map<string, ScrapedPage> {
    return this.results;
  }

  public clearResults(): void {
    this.results.clear();
    this.visitedUrls.clear();
    this.queue = [UPIICSA_BASE_URL];
  }
}

export const scraper = new UPIICSAScraper();