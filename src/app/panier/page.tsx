'use client';

import Link from 'next/link';
import { usePanier } from '@/store/cart';
import { formatPrix, fraisLivraison } from '@/lib/utils';
import { useState } from 'react';
import { VisuelProduit } from '@/components/VisuelProduit';

export default function PanierPage() {
  const { articles, modifierQuantite, retirer, vider } = usePanier();
  const [monte, setMonte] = useState(false);

  // Évite le flash "panier vide" avant hydratation depuis localStorage
  if (typeof window !== 'undefined' && !monte) setTimeout(() => setMonte(true), 0);

  const total = articles.reduce((t, a) => t + a.prix * a.quantite, 0);
  const fraisPort = fraisLivraison(total);

  if (articles.length === 0) {
    return (
      <div className="conteneur py-16">
        <h1 className="text-2xl font-bold text-terre">Votre panier</h1>
        <div className="carte mt-6 p-10 text-center">
          <p className="text-slate-600">Votre panier est vide pour le moment.</p>
          <Link href="/produits" className="bouton-primaire mt-5">Parcourir le catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="conteneur py-10">
      <h1 className="titre text-3xl font-bold">Votre panier</h1>
      <p className="mt-1 text-sm text-slate-600">{articles.length} référence(s)</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="carte divide-y divide-slate-100 lg:col-span-2">
          {articles.map((a) => (
            <div key={a.produitId} className="flex gap-4 p-4">
              <Link href={`/produits/${a.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <VisuelProduit src={a.image} alt={a.nom} className="h-full w-full object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/produits/${a.slug}`} className="font-semibold text-terre hover:text-marque-700">
                  {a.nom}
                </Link>
                <p className="mt-0.5 text-sm text-slate-500">{formatPrix(a.prix)} l&apos;unité</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-lg ring-1 ring-slate-200">
                    <button className="px-2.5 py-1.5 text-slate-600" onClick={() => modifierQuantite(a.produitId, a.quantite - 1)} aria-label="Diminuer">−</button>
                    <span className="w-8 text-center text-sm">{a.quantite}</span>
                    <button className="px-2.5 py-1.5 text-slate-600" onClick={() => modifierQuantite(a.produitId, a.quantite + 1)} aria-label="Augmenter">+</button>
                  </div>
                  <button onClick={() => retirer(a.produitId)} className="text-xs font-semibold text-rose-600 hover:underline">
                    Retirer
                  </button>
                </div>
              </div>

              <p className="shrink-0 font-bold text-terre">{formatPrix(a.prix * a.quantite)}</p>
            </div>
          ))}

          <div className="p-4">
            <button onClick={vider} className="bouton-danger">Vider le panier</button>
          </div>
        </div>

        <aside className="carte h-fit p-5">
          <h2 className="font-bold text-terre">Récapitulatif</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-600">Sous-total</dt><dd className="font-medium">{formatPrix(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-600">Livraison</dt><dd className="font-medium">{fraisPort === 0 ? 'Offerte' : formatPrix(fraisPort)}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrix(total + fraisPort)}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-slate-500">Livraison offerte partout en Côte d&apos;Ivoire dès 50 000 FCFA.</p>
          <Link href="/commande" className="bouton-primaire mt-5 w-full">Passer la commande</Link>
          <Link href="/produits" className="mt-2 block text-center text-sm text-slate-600 hover:text-marque-700">
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  );
}
