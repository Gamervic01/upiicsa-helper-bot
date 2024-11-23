import axios from 'axios';
import { SELECTORS, BASE_URL } from './config';
import type { ScrapedPage, ScrapingResult } from './types';
import { toast } from 'sonner';

class UPIICSAScraper {
    private visitedUrls: Set<string> = new Set();
    private results: Map<string, ScrapedPage> = new Map();

    private normalizeUrl(url: string): string {
        if (url.startsWith('http')) return url;
        if (url.startsWith('//')) return `https:${url}`;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    private async extractMenuItems(html: string): Promise<string[]> {
        const menuUrls = new Set<string>();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const mainMenuLinks = Array.from(doc.querySelectorAll(SELECTORS.menu))
            .map(link => (link as HTMLAnchorElement).href);
        
        const subMenuLinks = Array.from(doc.querySelectorAll(SELECTORS.subMenu))
            .map(link => (link as HTMLAnchorElement).href);
        
        [...mainMenuLinks, ...subMenuLinks].forEach(url => 
            menuUrls.add(this.normalizeUrl(url))
        );
        
        return Array.from(menuUrls);
    }

    private async scrapePage(url: string): Promise<ScrapingResult> {
        try {
            if (this.visitedUrls.has(url)) {
                return { success: true, data: this.results.get(url) };
            }

            console.log(`Scraping: ${url}`);
            const response = await axios.get(url);
            const html = response.data;
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const title = doc.querySelector(SELECTORS.title)?.textContent?.trim() || '';
            const contentElements = Array.from(doc.querySelectorAll(SELECTORS.content));
            const content = contentElements.map(el => el.textContent?.trim()).join('\n');
            
            // Fix: Properly type the links array
            const links = Array.from(doc.querySelectorAll(SELECTORS.links))
                .map(link => {
                    const href = (link as HTMLAnchorElement).href;
                    return {
                        url: href,
                        text: link.textContent?.trim() || '',
                        type: href.endsWith('.pdf') ? 'pdf' as const : 
                              href.startsWith(BASE_URL) ? 'internal' as const : 
                              'external' as const
                    };
                });

            const scrapedPage: ScrapedPage = {
                url,
                title: title || url,
                content: content || '',
                links,
                lastScraped: new Date()
            };

            this.results.set(url, scrapedPage);
            this.visitedUrls.add(url);

            return { success: true, data: scrapedPage };
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
        try {
            console.log('Starting scraping process...');
            
            const response = await axios.get(BASE_URL);
            const menuUrls = await this.extractMenuItems(response.data);

            for (const url of menuUrls) {
                if (!this.visitedUrls.has(url)) {
                    await this.scrapePage(url);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            console.log(`Scraping completed. Processed ${this.results.size} pages.`);
            return this.results;
        } catch (error) {
            console.error('Error during scraping:', error);
            toast.error('Error al obtener información del sitio');
            throw error;
        }
    }

    public getResults(): Map<string, ScrapedPage> {
        return this.results;
    }
}

export const scraper = new UPIICSAScraper();