import { SELECTORS, BASE_URL, SECTIONS } from './config';
import type { ScrapedPage, ScrapingResult, ScrapedLink } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

class UPIICSAScraper {
    private visitedUrls: Set<string> = new Set();
    private results: Map<string, ScrapedPage> = new Map();
    private menuStructure: Map<string, string[]> = new Map();

    private normalizeUrl(url: string): string {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('//')) return `https:${url}`;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    private isValidInternalUrl(url: string): boolean {
        try {
            const normalizedUrl = this.normalizeUrl(url);
            const urlObj = new URL(normalizedUrl);
            return urlObj.hostname === 'www.upiicsa.ipn.mx' && 
                   !url.includes('#') && 
                   !url.endsWith('.pdf') &&
                   !url.endsWith('.doc') &&
                   !url.endsWith('.docx');
        } catch {
            return false;
        }
    }

    private async extractMenuItems(html: string, section?: string): Promise<string[]> {
        const menuUrls = new Set<string>();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract main menu items first
        const mainMenuLinks = Array.from(doc.querySelectorAll(SELECTORS.mainMenu))
            .map(link => {
                const href = (link as HTMLAnchorElement).href;
                const text = link.textContent?.trim() || '';
                return { href, text };
            })
            .filter(link => this.isValidInternalUrl(link.href));

        // Extract submenu items
        const subMenuLinks = Array.from(doc.querySelectorAll(SELECTORS.subMenu))
            .map(link => {
                const href = (link as HTMLAnchorElement).href;
                const text = link.textContent?.trim() || '';
                return { href, text };
            })
            .filter(link => this.isValidInternalUrl(link.href));

        // If we're looking at a specific section, filter for relevant links
        if (section) {
            [...mainMenuLinks, ...subMenuLinks].forEach(link => {
                if (link.href.includes(section)) {
                    menuUrls.add(this.normalizeUrl(link.href));
                    this.menuStructure.set(section, 
                        [...(this.menuStructure.get(section) || []), link.href]
                    );
                }
            });
        } else {
            [...mainMenuLinks, ...subMenuLinks].forEach(link => 
                menuUrls.add(this.normalizeUrl(link.href))
            );
        }

        return Array.from(menuUrls);
    }

    private async scrapePage(url: string): Promise<ScrapingResult> {
        try {
            if (this.visitedUrls.has(url)) {
                return { success: true, data: this.results.get(url) };
            }

            console.log(`Scraping: ${url}`);
            const { data, error } = await supabase.functions.invoke('proxy', {
                body: { url }
            });

            if (error) throw error;
            if (!data || !data.html) throw new Error('No data received from proxy');
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.html, 'text/html');

            const title = doc.querySelector(SELECTORS.title)?.textContent?.trim() || '';
            const contentElements = Array.from(doc.querySelectorAll(SELECTORS.content));
            const content = contentElements.map(el => el.textContent?.trim()).join('\n');
            
            const links: ScrapedLink[] = Array.from(doc.querySelectorAll(SELECTORS.links))
                .map(link => {
                    const href = (link as HTMLAnchorElement).href;
                    const text = link.textContent?.trim() || '';
                    const type = href.endsWith('.pdf') ? 'pdf' : 
                               this.isValidInternalUrl(href) ? 'internal' : 
                               'external';
                    return { url: href, text, type };
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
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            };
        }
    }

    public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
        try {
            console.log('Starting scraping process...');
            
            // First, scrape the main page to get the menu structure
            const { data, error } = await supabase.functions.invoke('proxy', {
                body: { url: BASE_URL }
            });

            if (error) throw error;
            if (!data || !data.html) throw new Error('No data received from proxy');

            // Extract menu items for each main section
            for (const section of Object.values(SECTIONS)) {
                const sectionUrls = await this.extractMenuItems(data.html, section);
                console.log(`Found ${sectionUrls.length} URLs for section ${section}`);

                // Scrape each URL in the section
                for (const url of sectionUrls) {
                    if (!this.visitedUrls.has(url)) {
                        await this.scrapePage(url);
                        // Add a small delay between requests
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
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

    public getMenuStructure(): Map<string, string[]> {
        return this.menuStructure;
    }
}

export const scraper = new UPIICSAScraper();