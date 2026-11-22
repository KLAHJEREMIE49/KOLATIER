'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ArticleFavori = {
  produitId: number;
  nom: string;
  slug: string;
  prix: number;
  image: string | null;
  stock: number;
};

type FavorisState = {
  articles: ArticleFavori[];
  basculer: (article: ArticleFavori) => void;
  retire: (produitId: number) => void;
  vider: () => void;
};

/** Liste d'envies persistée dans le navigateur (aucune donnée côté serveur). */
export const useFavoris = create<FavorisState>()(
  persist(
    (set) => ({
      articles: [],
      basculer: (article) =>
        set((state) => {
          const existe = state.articles.some((a) => a.produitId === article.produitId);
          return {
            articles: existe
              ? state.articles.filter((a) => a.produitId !== article.produitId)
              : [...state.articles, article],
          };
        }),
      retire: (produitId) => set((state) => ({ articles: state.articles.filter((a) => a.produitId !== produitId) })),
      vider: () => set({ articles: [] }),
    }),
    { name: 'favoris-kolatier' },
  ),
);
