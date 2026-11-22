'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SUGGESTIONS = [
  { label: 'Attiéké', href: '/produits?q=attiéké' },
  { label: 'Pagne wax', href: '/produits?categorie=mode-pagnes' },
  { label: 'Karité', href: '/produits?q=karité' },
  { label: 'Alloco', href: '/produits?q=alloco' },
  { label: 'Café de Man', href: '/produits?q=café' },
];

/** Barre de recherche centrale du header, avec suggestions rapides. */
export function BarreRecherche({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [terme, setTerme] = useState('');
  const [ouvert, setOuvert] = useState(false);

  function chercher(e: React.FormEvent) {
    e.preventDefault();
    const valeur = terme.trim();
    router.push(valeur ? `/produits?q=${encodeURIComponent(valeur)}` : '/produits');
    setOuvert(false);
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={chercher}
        role="search"
        className={`flex w-full items-center gap-2 rounded-full bg-white pl-4 pr-1.5 ring-1 transition focus-within:ring-2 ${
          compact ? 'h-11' : 'h-12'
        } ${ouvert ? 'ring-marque-400 shadow-halo' : 'ring-marque-100 hover:ring-marque-200'}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-marque-600" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" strokeLinecap="round" />
        </svg>
        <input
          value={terme}
          onChange={(e) => setTerme(e.target.value)}
          onFocus={() => setOuvert(true)}
          onBlur={() => setTimeout(() => setOuvert(false), 140)}
          placeholder="Rechercher un attiéké, un pagne, du karité…"
          aria-label="Rechercher un produit"
          className="min-w-0 flex-1 bg-transparent text-sm text-terre outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-gradient-to-b from-marque-500 to-marque-600 px-4 py-2 text-xs font-extrabold text-white transition hover:from-marque-600 hover:to-marque-700"
        >
          Chercher
        </button>
      </form>

      {ouvert && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl bg-white p-3 shadow-premium ring-1 ring-marque-100">
          <p className="px-1 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Recherches populaires
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  router.push(s.href);
                  setOuvert(false);
                }}
                className="rounded-full bg-marque-50 px-3 py-1.5 text-xs font-semibold text-marque-800 transition hover:bg-marque-100"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
