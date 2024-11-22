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

      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');

      // Extract content
      const contentElements = doc.querySelectorAll(SELECTORS.content);
      const content = Array.from(contentElements)
        .map(el => el.textContent)
        .join('\n');

      // Extract links
      const linkElements = doc.querySelectorAll(SELECTORS.links);
      const links: ScrapedLink[] = Array.from(linkElements)
        .map(el => ({
          url: (el as HTMLAnchorElement).href || '',
          text: el.textContent || '',
          type: 'internal'
        }))
        .filter(link => link.url);

      const title = doc.title || url;

      const scrapedPage: ScrapedPage = {
        url,
        title,
        content: content || '',
        links,
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