import axios from 'axios';
import cheerio from 'cheerio';
import { UPIICSA_BASE_URL, SELECTORS } from './config';
import type { ScrapedPage, ScrapingResult } from './types';

class UPIICSAScraper {
    private visitedUrls: Set<string> = new Set();
    private results: Map<string, ScrapedPage> = new Map();

    constructor() {
        this.visitedUrls.add(UPIICSA_BASE_URL);
    }

    private async scrapePage(url: string): Promise<ScrapingResult> {
        try {
            console.log(`Scraping: ${url}`);
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            const title = $(SELECTORS.title).first().text().trim();
            const content = $(SELECTORS.content)
                .map((_, el) => $(el).text().trim())
                .get()
                .join('\n');

            const links = $(SELECTORS.links)
                .map((_, el) => $(el).attr('href'))
                .get()
                .filter(link => link && link.startsWith('/'))
                .map(link => `${UPIICSA_BASE_URL}${link}`);

            const scrapedPage: ScrapedPage = {
                url,
                title: title || 'Sin título',
                content: content || 'Sin contenido',
                links,
                lastScraped: new Date()
            };

            this.results.set(url, scrapedPage);
            this.visitedUrls.add(url);

            return { success: true, data: scrapedPage };
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
            return { success: false, error: error.message };
        }
    }

    public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
        try {
            console.log('Starting scraping process...');
            const mainPages = [
                `${UPIICSA_BASE_URL}/servicio-social`,
                `${UPIICSA_BASE_URL}/practicas-profesionales`,
                `${UPIICSA_BASE_URL}/titulacion`
            ];

            for (const url of mainPages) {
                if (!this.visitedUrls.has(url)) {
                    await this.scrapePage(url);
                }
            }

            console.log(`Scraping completed. Processed ${this.results.size} pages.`);
            return this.results;
        } catch (error) {
            console.error('Error during scraping:', error);
            throw error;
        }
    }

    public getResults(): Map<string, ScrapedPage> {
        return this.results;
    }
}

export const scraper = new UPIICSAScraper();
