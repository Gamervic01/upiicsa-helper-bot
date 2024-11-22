import { useEffect } from 'react';
import { scraper } from '../services/scraper/scraper';
import { useScraperStore } from '../services/scraper/store';

export const useScraper = () => {
  const { setPages, setLoading, setError } = useScraperStore();

  const startScraping = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await scraper.scrapeAll();
      setPages(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error durante el scraping');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startScraping();
  }, []);

  return {
    startScraping,
    ...useScraperStore()
  };
};