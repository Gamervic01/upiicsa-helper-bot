import axios from 'axios';
import cheerio from 'cheerio';
import { SELECTORS } from './config';
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

    private async scrapePage(url: string): Promise<ScrapingResult> {
        try {
            console.log(`Scraping: ${url}`);
            const html = await this.fetchWithProxy(url);
            const $ = cheerio.load(html);

            // Extraer título y contenido
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
                    
                    // Convertir URLs relativas a absolutas
                    const absoluteUrl = href.startsWith('http') 
                        ? href 
                        : `https://www.upiicsa.ipn.mx${href.startsWith('/') ? '' : '/'}${href}`;
                    
                    return absoluteUrl;
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
            return { success: false, error: error.message };
        }
    }

    public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
        try {
            console.log('Starting scraping process...');
            
            // Comenzar con la página principal
            const mainUrl = 'https://www.upiicsa.ipn.mx';
            await this.scrapePage(mainUrl);

            // Procesar páginas encontradas
            const pagesToVisit = Array.from(this.results.values())
                .flatMap(page => page.links)
                .map(link => link.url)
                .filter(url => 
                    url.includes('upiicsa.ipn.mx') && 
                    !this.visitedUrls.has(url) &&
                    (url.includes('electivas') || 
                     url.includes('servicio-social') || 
                     url.includes('practicas') || 
                     url.includes('titulacion'))
                );

            for (const url of pagesToVisit) {
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