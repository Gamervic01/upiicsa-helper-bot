import { useEffect } from 'react';
import { scraper } from '../services/scraper/scraper';
import { useScraperStore } from '../services/scraper/store';
import { toast } from 'sonner';

export const useScraper = () => {
  const { setPages, setLoading, setError } = useScraperStore();

  const startScraping = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await scraper.scrapeAll();
      setPages(results);
      toast.success('Base de conocimiento actualizada');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error durante el scraping';
      setError(errorMessage);
      toast.error(errorMessage);
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