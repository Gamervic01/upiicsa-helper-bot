import { create } from 'zustand';
import type { ScrapedPage } from './types';

interface ScraperStore {
  pages: Map<string, ScrapedPage>;
  isLoading: boolean;
  error: string | null;
  setPages: (pages: Map<string, ScrapedPage>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useScraperStore = create<ScraperStore>((set) => ({
  pages: new Map(),
  isLoading: false,
  error: null,
  setPages: (pages) => set({ pages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));