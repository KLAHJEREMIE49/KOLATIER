'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type Categorie = { id: number; nom: string; slug: string };

/** Recherche, origine et filtres du catalogue, synchronisés avec l’URL. */
export function Filtres({
  categories,
  origines,
}: {
  categories: Categorie[];
  origines: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [enTransition, commencerTransition] = useTransition();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [categorie, setCategorie] = useState(params.get('categorie') ?? '');
  const [origine, setOrigine] = useState(params.get('origine') ?? '');
  const [min, setMin] = useState(params.get('min') ?? '');
  const [max, setMax] = useState(params.get('max') ?? '');
  const [tri, setTri] = useState(params.get('tri') ?? 'recent');
  const [disponible, setDisponible] = useState(params.get('stock') === 'disponible');
  const [filtresOuverts, setFiltresOuverts] = useState(Boolean(
    params.get('categorie') || params.get('origine') || params.get('min') || params.get('max') ||
    params.get('stock') || (params.get('tri') && params.get('tri') !== 'recent'),
  ));
  const parametresUrl = params.toString();

  useEffect(() => {
    const url = new URLSearchParams(parametresUrl);
    setQ(url.get('q') ?? '');
    setCategorie(url.get('categorie') ?? '');
    setOrigine(url.get('origine') ?? '');
    setMin(url.get('min') ?? '');
    setMax(url.get('max') ?? '');
    setTri(url.get('tri') ?? 'recent');
    setDisponible(url.get('stock') === 'disponible');
    setFiltresOuverts(Boolean(
      url.get('categorie') || url.get('origine') || url.get('min') || url.get('max') ||
      url.get('stock') || (url.get('tri') && url.get('tri') !== 'recent'),
    ));
  }, [parametresUrl]);

  function appliquer() {
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (categorie) p.set('categorie', categorie);
    if (origine) p.set('origine', origine);
    if (min) p.set('min', min);
    if (max) p.set('max', max);
    if (tri && tri !== 'recent') p.set('tri', tri);
    if (disponible) p.set('stock', 'disponible');
    const query = p.toString();
    commencerTransition(() => router.push(query ? `/produits?${query}` : '/produits'));
  }

  function reinitialiser() {
    setQ('');
    setCategorie('');
    setOrigine('');
    setMin('');
    setMax('');
    setTri('recent');
    setDisponible(false);
    setFiltresOuverts(false);
    commencerTransition(() => router.push('/produits'));
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); appliquer(); }}
      className="carte grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6"
      aria-busy={enTransition}
    >
      <div className="lg:col-span-2">
        <label className="etiquette" htmlFor="q">Recherche</label>
        <input
          id="q"
          className="champ"
          placeholder="Produit, artisan, origine ou matière…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={() => setFiltresOuverts((ouvert) => !ouvert)}
        aria-expanded={filtresOuverts}
        className="bouton-secondaire justify-between sm:hidden"
      >
        {filtresOuverts ? 'Masquer les filtres' : 'Catégorie, origine, prix et tri'}
        <span aria-hidden="true">{filtresOuverts ? '−' : '+'}</span>
      </button>

      <div className={`${filtresOuverts ? 'grid' : 'hidden'} min-w-0 grid-cols-1 gap-3 sm:contents`}>
      <div className="min-w-0">
        <label className="etiquette" htmlFor="cat">Catégorie</label>
        <select id="cat" className="champ" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.nom}</option>)}
        </select>
      </div>

      <div className="min-w-0">
        <label className="etiquette" htmlFor="origine">Ville / origine</label>
        <select id="origine" className="champ" value={origine} onChange={(e) => setOrigine(e.target.value)}>
          <option value="">Toutes les origines</option>
          {origines.map((ville) => <option key={ville} value={ville}>{ville}</option>)}
        </select>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2">
        <div className="min-w-0">
          <label className="etiquette" htmlFor="min">Prix min (FCFA)</label>
          <input id="min" type="number" min={0} step={1} className="champ" value={min} onChange={(e) => setMin(e.target.value)} />
        </div>
        <div>
          <label className="etiquette" htmlFor="max">Prix max (FCFA)</label>
          <input id="max" type="number" min={0} step={1} className="champ" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="etiquette" htmlFor="tri">Trier par</label>
        <select id="tri" className="champ" value={tri} onChange={(e) => setTri(e.target.value)}>
          <option value="recent">Nouveautés</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
          <option value="nom">Nom (A-Z)</option>
        </select>
      </div>

      <div className="flex min-w-0 flex-wrap items-end gap-3 sm:col-span-2 lg:col-span-6">
        <label className="flex min-h-11 items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-foret-700 focus:ring-foret-600" />
          Articles disponibles uniquement
        </label>
        <button type="submit" disabled={enTransition} className="bouton-primaire min-w-36">
          {enTransition ? 'Recherche…' : 'Afficher les produits'}
        </button>
        <button type="button" onClick={reinitialiser} disabled={enTransition} className="bouton-secondaire">Tout effacer</button>
        <span className="text-xs text-slate-500" aria-live="polite">
          {enTransition ? 'Mise à jour du catalogue…' : 'Recherche dans les noms, origines, artisans et matières.'}
        </span>
      </div>
      </div>
    </form>
  );
}
