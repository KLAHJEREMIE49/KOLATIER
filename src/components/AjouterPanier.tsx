'use client';

import { useState } from 'react';
import { usePanier, type ArticlePanier } from '@/store/cart';

type ProduitPanier = Omit<ArticlePanier, 'quantite'>;

/** Bouton "Ajouter au panier" réutilisable (carte produit + page détail). */
export function BoutonAjout({ produit, avecQuantite = false }: { produit: ProduitPanier; avecQuantite?: boolean }) {
  const ajouter = usePanier((s) => s.ajouter);
  const [quantite, setQuantite] = useState(1);
  const [confirme, setConfirme] = useState(false);
  const epuise = produit.stock <= 0;

  function ajouterAuPanier() {
    ajouter(produit, quantite);
    setConfirme(true);
    setTimeout(() => setConfirme(false), 1800);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {avecQuantite && (
        <div className="flex items-center rounded-lg ring-1 ring-slate-200">
          <button
            type="button"
            className="px-3 py-2 text-slate-600 hover:text-marque-700"
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={produit.stock}
            value={quantite}
            onChange={(e) => setQuantite(Math.max(1, Math.min(produit.stock, Number(e.target.value) || 1)))}
            className="w-14 border-0 bg-transparent text-center text-sm focus:outline-none"
          />
          <button
            type="button"
            className="px-3 py-2 text-slate-600 hover:text-marque-700"
            onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={ajouterAuPanier}
        disabled={epuise}
        aria-live="polite"
        className="bouton-primaire flex-1"
      >
        {epuise ? 'Indisponible' : confirme ? '✓ Ajouté au panier' : 'Ajouter au panier'}
      </button>
    </div>
  );
}
