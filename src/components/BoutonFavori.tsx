'use client';

import { useEffect, useState } from 'react';
import { useFavoris } from '@/store/favoris';

/** Cœur « ajouter aux favoris » posé sur les cartes produit. */
export function BoutonFavori({
  produit,
  className = '',
}: {
  produit: { produitId: number; nom: string; slug: string; prix: number; image: string | null; stock: number };
  className?: string;
}) {
  const [monte, setMonte] = useState(false);
  const articles = useFavoris((s) => s.articles);
  const basculer = useFavoris((s) => s.basculer);

  useEffect(() => setMonte(true), []);
  const actif = monte && articles.some((a) => a.produitId === produit.produitId);

  return (
    <button
      type="button"
      aria-label={actif ? `Retirer ${produit.nom} des favoris` : `Ajouter ${produit.nom} aux favoris`}
      aria-pressed={actif}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        basculer(produit);
      }}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-md ring-1 backdrop-blur transition hover:scale-110 ${
        actif ? 'text-rose-600 ring-rose-200' : 'text-slate-400 ring-marque-100 hover:text-rose-500'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" style={{ height: 18, width: 18 }} fill={actif ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M12 20.4 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13Z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
