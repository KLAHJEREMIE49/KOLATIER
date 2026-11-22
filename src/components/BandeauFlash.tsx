'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrix } from '@/lib/utils';

export type PromoFlash = {
  id: number;
  nom: string;
  slug: string;
  prix: string | number | { toString(): string };
  ancienPrix: string | number | { toString(): string } | null;
  image: string | null;
  stock: number;
};

const enNombre = (v: string | number | { toString(): string } | null) => (v === null ? 0 : Number(v.toString()));

/** Bandeau « Offres flash » : compte à rebours calculé côté client (aucun décalage d'hydratation). */
export function BandeauFlash({ produits }: { produits: PromoFlash[] }) {
  const [restant, setRestant] = useState<{ j: string; h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    // Fin de l'offre : 23 h 59 heure d'Abidjan (UTC+0), donc minuit UTC.
    function calculer() {
      const fin = new Date();
      fin.setUTCHours(23, 59, 59, 999);
      const diff = Math.max(0, fin.getTime() - Date.now());
      const j = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRestant({
        j: String(j).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    }
    calculer();
    const id = setInterval(calculer, 1000);
    return () => clearInterval(id);
  }, []);

  if (produits.length === 0) return null;

  const blocs: { valeur: string; label: string }[] = [
    { valeur: restant?.j ?? '--', label: 'Jours' },
    { valeur: restant?.h ?? '--', label: 'Heures' },
    { valeur: restant?.m ?? '--', label: 'Min' },
    { valeur: restant?.s ?? '--', label: 'Sec' },
  ];

  return (
    <section className="conteneur py-8">
      <div className="relative overflow-hidden rounded-3xl bg-terre shadow-premium ring-1 ring-marque-900/40">
        <div className="motif-pagne absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-marque-500/25 blur-3xl" aria-hidden="true" />

        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-marque-500 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" aria-hidden="true" />
              Offres flash
            </span>
            <h2 className="titre mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Jusqu’à <span className="text-marque-300">−35 %</span> aujourd’hui seulement
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ivoire/75">
              Attiéké de Dabou, karité brut, pagnes wax et paniers du marché : les prix du jour
              disparaissent à minuit, heure d’Abidjan.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {blocs.map((b) => (
                <div
                  key={b.label}
                  className="min-w-[58px] rounded-xl bg-white/10 px-2.5 py-2 text-center ring-1 ring-white/20 backdrop-blur"
                >
                  <p className="font-titre text-xl font-extrabold tabular-nums text-white sm:text-2xl">{b.valeur}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-marque-200">{b.label}</p>
                </div>
              ))}
              <Link href="/produits?tri=promo" className="bouton-primaire ml-1 !px-4 !py-2.5 text-sm">
                Voir les offres →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:gap-3">
            {produits.slice(0, 4).map((p) => {
              const prix = enNombre(p.prix);
              const ancien = enNombre(p.ancienPrix);
              const remise = ancien > prix ? Math.round(((ancien - prix) / ancien) * 100) : 0;
              return (
                <Link
                  key={p.id}
                  href={`/produits/${p.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white/95 ring-1 ring-white/30 transition hover:-translate-y-1 hover:shadow-premium"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image ?? '/images/legumes.webp'}
                      alt={p.nom}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {remise > 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow">
                        -{remise}%
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-[11px] font-bold leading-tight text-terre">{p.nom}</p>
                    <p className="mt-1 text-[13px] font-extrabold text-marque-700">{formatPrix(prix)}</p>
                    {ancien > prix && (
                      <p className="text-[10px] font-semibold text-slate-400 line-through">{formatPrix(ancien)}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
