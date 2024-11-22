import axios from 'axios';
import { load } from 'cheerio';
import * as pdfjsLib from 'pdfjs-dist';
import { UPIICSA_BASE_URL, ALLOWED_DOMAINS, SCRAPING_RULES, SELECTORS } from './config';
import type { ScrapedPage, ScrapedLink, ScrapingResult } from './types';
import { toast } from 'sonner';

class UPIICSAScraper {
  private visitedUrls: Set<string> = new Set();
  private queue: string[] = [];
  private results: Map<string, ScrapedPage> = new Map();

  constructor() {
    this.queue.push(UPIICSA_BASE_URL);
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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

  private normalizeUrl(url: string, baseUrl: string): string {
    try {
      if (url.startsWith('//')) {
        return `https:${url}`;
      }
      if (url.startsWith('/')) {
        return new URL(url, baseUrl).href;
      }
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  private async extractTextFromPDF(pdfData: ArrayBuffer): Promise<string> {
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return '';
    }
  }

  private async scrapePage(url: string): Promise<ScrapingResult> {
    try {
      console.log(`Scraping: ${url}`);
      
      const response = await axios.get(url, {
        responseType: url.toLowerCase().endsWith('.pdf') ? 'arraybuffer' : 'text',
        timeout: 10000
      });
      
      if (url.toLowerCase().endsWith('.pdf')) {
        const pdfText = await this.extractTextFromPDF(response.data);
        const scrapedPage: ScrapedPage = {
          url,
          title: url.split('/').pop() || url,
          content: pdfText,
          links: [],
          lastScraped: new Date(),
          pdfContent: pdfText
        };
        
        this.results.set(url, scrapedPage);
        this.visitedUrls.add(url);
        
        return { success: true, data: scrapedPage };
      }

      const $ = load(response.data);
      
      const links: ScrapedLink[] = [];
      $(SELECTORS.links).each((_, element) => {
        const link = $(element);
        const href = link.attr('href');
        if (href) {
          const normalizedUrl = this.normalizeUrl(href, url);
          if (this.isAllowedUrl(normalizedUrl) && !this.visitedUrls.has(normalizedUrl)) {
            this.queue.push(normalizedUrl);
            links.push({
              url: normalizedUrl,
              text: link.text().trim(),
              type: 'internal'
            });
          }
        }
      });

      const content = $(SELECTORS.content)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0)
        .join('\n');

      const scrapedPage: ScrapedPage = {
        url,
        title: $(SELECTORS.title).text().trim() || url.split('/').pop() || url,
        content,
        links,
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

      while (this.queue.length > 0 && this.visitedUrls.size < maxPages) {
        const url = this.queue.shift();
        if (url && !this.visitedUrls.has(url)) {
          await this.scrapePage(url);
          processedCount++;
          
          if (processedCount % 5 === 0) {
            console.log(`Processed ${processedCount} pages. Queue size: ${this.queue.length}`);
          }
          
          // Add delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000));
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