'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrix } from '@/lib/utils';
import { useFavoris } from '@/store/favoris';
import { usePanier } from '@/store/cart';

/** Page « Mes favoris » : liste locale (localStorage), ajout au panier en un clic. */
export default function FavorisPage() {
  const [monte, setMonte] = useState(false);
  const articles = useFavoris((s) => s.articles);
  const retire = useFavoris((s) => s.retire);
  const vider = useFavoris((s) => s.vider);
  const ajouter = usePanier((s) => s.ajouter);

  useEffect(() => setMonte(true), []);

  const liste = monte ? articles : [];

  return (
    <div className="conteneur py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-rose-600">Liste d’envies</p>
          <h1 className="titre mt-1 text-3xl font-extrabold">Mes favoris</h1>
          <p className="mt-1 text-sm text-slate-600">
            {liste.length > 0
              ? `${liste.length} produit${liste.length > 1 ? 's' : ''} gardé${liste.length > 1 ? 's' : ''} de côté.`
              : 'Touchez le cœur sur une fiche produit pour la retrouver ici.'}
          </p>
        </div>
        {liste.length > 0 && (
          <button onClick={vider} className="bouton-danger !py-2 text-xs">
            Vider la liste
          </button>
        )}
      </header>

      {liste.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-carte ring-1 ring-marque-100">
          <p className="text-4xl" aria-hidden="true">🤍</p>
          <p className="mt-3 text-sm text-slate-600">Aucun favori pour le moment.</p>
          <Link href="/produits" className="bouton-primaire mt-4">
            Découvrir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {liste.map((a) => (
            <article key={a.produitId} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-carte ring-1 ring-marque-100/70">
              <Link href={`/produits/${a.slug}`} className="block aspect-square overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image ?? '/images/legumes.webp'} alt={a.nom} className="h-full w-full object-cover" loading="lazy" />
              </Link>
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <Link href={`/produits/${a.slug}`} className="line-clamp-2 text-sm font-bold text-terre hover:text-marque-700">
                  {a.nom}
                </Link>
                <p className="text-base font-extrabold text-marque-700">{formatPrix(a.prix)}</p>
                <div className="mt-auto flex flex-col gap-1.5 pt-1">
                  <button
                    onClick={() =>
                      ajouter({ produitId: a.produitId, nom: a.nom, slug: a.slug, prix: a.prix, image: a.image, stock: a.stock })
                    }
                    disabled={a.stock <= 0}
                    className="bouton-primaire !py-2 text-xs"
                  >
                    {a.stock > 0 ? 'Ajouter au panier' : 'Épuisé'}
                  </button>
                  <button onClick={() => retire(a.produitId)} className="text-[11px] font-semibold text-slate-500 hover:text-rose-600">
                    Retirer des favoris
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
