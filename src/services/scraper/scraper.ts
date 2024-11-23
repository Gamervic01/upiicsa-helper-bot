import puppeteer from 'puppeteer';
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

    private async extractMenuItems(page: puppeteer.Page): Promise<string[]> {
        const menuUrls = new Set<string>();
        
        // Obtener URLs del menú principal y submenús
        const urls = await page.evaluate((selectors) => {
            const mainMenuLinks = Array.from(document.querySelectorAll(selectors.menu))
                .map(link => (link as HTMLAnchorElement).href);
            
            const subMenuLinks = Array.from(document.querySelectorAll(selectors.subMenu))
                .map(link => (link as HTMLAnchorElement).href);
            
            return [...mainMenuLinks, ...subMenuLinks];
        }, SELECTORS);

        urls.forEach(url => menuUrls.add(this.normalizeUrl(url)));
        return Array.from(menuUrls);
    }

    private async scrapePage(browser: puppeteer.Browser, url: string): Promise<ScrapingResult> {
        try {
            if (this.visitedUrls.has(url)) {
                return { success: true, data: this.results.get(url) };
            }

            console.log(`Scraping: ${url}`);
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });

            const content = await page.evaluate((selectors) => {
                const title = document.querySelector(selectors.title)?.textContent?.trim() || '';
                const contentElements = Array.from(document.querySelectorAll(selectors.content));
                const content = contentElements.map(el => el.textContent?.trim()).join('\n');
                const links = Array.from(document.querySelectorAll(selectors.links))
                    .map(link => ({
                        url: (link as HTMLAnchorElement).href,
                        text: link.textContent?.trim() || '',
                        type: (link as HTMLAnchorElement).href.endsWith('.pdf') ? 'pdf' : 'internal'
                    }));
                
                return { title, content, links };
            }, SELECTORS);

            await page.close();

            const scrapedPage: ScrapedPage = {
                url,
                title: content.title || url,
                content: content.content || '',
                links: content.links,
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
            
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
            
            const menuUrls = await this.extractMenuItems(page);
            await page.close();

            for (const url of menuUrls) {
                if (!this.visitedUrls.has(url)) {
                    await this.scrapePage(browser, url);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            await browser.close();
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