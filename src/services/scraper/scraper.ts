import * as cheerio from 'cheerio';
import axios from 'axios';
import { SELECTORS, BASE_URL } from './config';
import type { ScrapedPage, ScrapingResult } from './types';
import { toast } from 'sonner';

class UPIICSAScraper {
    private visitedUrls: Set<string> = new Set();
    private results: Map<string, ScrapedPage> = new Map();
    private proxyUrl = 'https://corsproxy.io/?';

    private async fetchWithProxy(url: string): Promise<string> {
        try {
            const response = await axios.get(`${this.proxyUrl}${encodeURIComponent(url)}`, {
                headers: {
                    'Accept': 'text/html',
                    'User-Agent': 'Mozilla/5.0 (compatible; UPIICSABot/1.0;)'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw new Error(`Error al obtener contenido de ${url}`);
        }
    }

    private normalizeUrl(url: string): string {
        if (url.startsWith('http')) return url;
        if (url.startsWith('//')) return `https:${url}`;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    private async extractMenuItems($: cheerio.CheerioAPI): Promise<string[]> {
        const menuUrls = new Set<string>();
        
        // Obtener todos los elementos del menú principal
        $(SELECTORS.mainMenu).each((_, menuItem) => {
            const $menuItem = $(menuItem);
            
            // Obtener el enlace principal del menú
            const mainLink = $menuItem.find('> a').attr('href');
            if (mainLink) {
                menuUrls.add(this.normalizeUrl(mainLink));
            }
            
            // Obtener enlaces del submenú
            $menuItem.find(SELECTORS.subMenu).each((_, subItem) => {
                const subLink = $(subItem).attr('href');
                if (subLink) {
                    menuUrls.add(this.normalizeUrl(subLink));
                }
            });
        });

        return Array.from(menuUrls);
    }

    private async scrapePage(url: string): Promise<ScrapingResult> {
        try {
            if (this.visitedUrls.has(url)) {
                return { success: true, data: this.results.get(url) };
            }

            console.log(`Scraping: ${url}`);
            const html = await this.fetchWithProxy(url);
            const $ = cheerio.load(html);

            const title = $(SELECTORS.title).first().text().trim();
            const content = $(SELECTORS.content)
                .map((_, el) => $(el).text().trim())
                .get()
                .join('\n');

            // Extraer enlaces relevantes
            const links = $(SELECTORS.links)
                .map((_, el) => {
                    const href = $(el).attr('href');
                    if (!href) return null;
                    return this.normalizeUrl(href);
                })
                .get()
                .filter(Boolean);

            const scrapedPage: ScrapedPage = {
                url,
                title: title || url,
                content: content || '',
                links: links.map(link => ({
                    url: link,
                    text: '',
                    type: link.endsWith('.pdf') ? 'pdf' : 'internal'
                })),
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
            
            // Comenzar con la página principal
            const mainPageResult = await this.scrapePage(BASE_URL);
            if (!mainPageResult.success || !mainPageResult.data) {
                throw new Error('Failed to scrape main page');
            }

            // Extraer URLs del menú
            const $ = cheerio.load(await this.fetchWithProxy(BASE_URL));
            const menuUrls = await this.extractMenuItems($);

            // Procesar cada URL del menú
            for (const url of menuUrls) {
                if (!this.visitedUrls.has(url)) {
                    await this.scrapePage(url);
                    // Pequeña pausa para no sobrecargar el servidor
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