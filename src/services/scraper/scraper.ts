import puppeteer from 'puppeteer';
import * as pdfjsLib from 'pdfjs-dist';
import { UPIICSA_BASE_URL, ALLOWED_DOMAINS, SCRAPING_RULES, SELECTORS } from './config';
import type { ScrapedPage, ScrapedLink, ScrapingResult } from './types';
import { toast } from 'sonner';

class UPIICSAScraper {
  private visitedUrls: Set<string> = new Set();
  private queue: string[] = [];
  private results: Map<string, ScrapedPage> = new Map();
  private browser: puppeteer.Browser | null = null;

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

      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }

      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      } catch (error) {
        console.error(`Error navigating to ${url}:`, error);
        await page.close();
        return { success: false, error: 'Error accessing page' };
      }

      // Extract content
      const content = await page.evaluate((selectors) => {
        const elements = document.querySelectorAll(selectors.content);
        return Array.from(elements).map(el => el.textContent).join('\n');
      }, SELECTORS);

      // Extract links
      const links: ScrapedLink[] = await page.evaluate((selectors) => {
        const linkElements = document.querySelectorAll(selectors.links);
        return Array.from(linkElements).map(el => ({
          url: el.getAttribute('href') || '',
          text: el.textContent || '',
          type: 'internal'
        }));
      }, SELECTORS);

      const title = await page.title();
      await page.close();

      const scrapedPage: ScrapedPage = {
        url,
        title: title || url,
        content: content || '',
        links: links.filter(link => link.url),
        lastScraped: new Date()
      };

      this.results.set(url, scrapedPage);
      this.visitedUrls.add(url);

      // Add new URLs to queue
      links
        .map(link => this.normalizeUrl(link.url))
        .filter(url => this.isAllowedUrl(url) && !this.visitedUrls.has(url))
        .forEach(url => this.queue.push(url));

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

      if (this.browser) {
        await this.browser.close();
        this.browser = null;
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