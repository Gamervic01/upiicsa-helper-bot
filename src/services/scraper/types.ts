export interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  links: ScrapedLink[];
  lastScraped: Date;
}

export interface ScrapedLink {
  url: string;
  text: string;
  type: 'internal' | 'external' | 'pdf';
}

export interface ScrapingResult {
  success: boolean;
  error?: string;
  data?: ScrapedPage;
}