'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ArticlePanier = {
  produitId: number;
  nom: string;
  slug: string;
  prix: number;
  image: string | null;
  stock: number;
  quantite: number;
};

type PanierState = {
  articles: ArticlePanier[];
  ajouter: (article: Omit<ArticlePanier, 'quantite'>, quantite?: number) => void;
  modifierQuantite: (produitId: number, quantite: number) => void;
  retirer: (produitId: number) => void;
  vider: () => void;
};

/**
 * Panier client persisté dans localStorage (Zustand + persist).
 * Le total est TOUJOURS recalculé côté serveur au moment de la commande :
 * le panier local ne sert qu'à l'affichage.
 */
export const usePanier = create<PanierState>()(
  persist(
    (set) => ({
      articles: [],

      ajouter: (article, quantite = 1) =>
        set((state) => {
          const existant = state.articles.find((a) => a.produitId === article.produitId);
          if (existant) {
            return {
              articles: state.articles.map((a) =>
                a.produitId === article.produitId
                  ? { ...a, quantite: Math.min(a.stock, a.quantite + quantite) }
                  : a
              ),
            };
          }
          return {
            articles: [...state.articles, { ...article, quantite: Math.min(article.stock, quantite) }],
          };
        }),

      modifierQuantite: (produitId, quantite) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.produitId === produitId
              ? { ...a, quantite: Math.max(1, Math.min(a.stock, quantite)) }
              : a
          ),
        })),

      retirer: (produitId) =>
        set((state) => ({ articles: state.articles.filter((a) => a.produitId !== produitId) })),

      vider: () => set({ articles: [] }),
    }),
    { name: 'panier-ecommerce' }
  )
);
