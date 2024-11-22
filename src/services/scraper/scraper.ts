import axios from 'axios';
import cheerio from 'cheerio';
import { UPIICSA_BASE_URL, ALLOWED_DOMAINS, SCRAPING_RULES, SELECTORS } from './config';
import type { ScrapedPage, ScrapedLink, ScrapingResult } from './types';

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

  private getLinkType(url: string): 'internal' | 'external' | 'pdf' {
    if (url.toLowerCase().endsWith('.pdf')) {
      return 'pdf';
    }
    return this.isAllowedUrl(url) ? 'internal' : 'external';
  }

  private async scrapePage(url: string): Promise<ScrapingResult> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      const links: ScrapedLink[] = [];
      $(SELECTORS.links).each((_, element) => {
        const link = $(element);
        const href = link.attr('href');
        if (href) {
          const normalizedUrl = this.normalizeUrl(href, url);
          links.push({
            url: normalizedUrl,
            text: link.text().trim(),
            type: this.getLinkType(normalizedUrl)
          });

          if (this.isAllowedUrl(normalizedUrl) && !this.visitedUrls.has(normalizedUrl)) {
            this.queue.push(normalizedUrl);
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
        title: $(SELECTORS.title).text().trim(),
        content,
        links,
        lastScraped: new Date()
      };

      this.results.set(url, scrapedPage);
      this.visitedUrls.add(url);

      return {
        success: true,
        data: scrapedPage
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
    while (this.queue.length > 0 && this.visitedUrls.size < SCRAPING_RULES.maxDepth * 10) {
      const url = this.queue.shift();
      if (url && !this.visitedUrls.has(url)) {
        console.log(`Scraping: ${url}`);
        await this.scrapePage(url);
        // Añadir un pequeño delay para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return this.results;
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