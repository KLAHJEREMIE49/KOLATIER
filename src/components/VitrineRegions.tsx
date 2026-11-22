'use client';

import { useMemo, useState } from 'react';
import { ProduitCarte, type ProduitAffiche } from '@/components/ProduitCarte';
import { VisuelProduit } from '@/components/VisuelProduit';

export type ProduitRegion = ProduitAffiche & {
  origine: string | null;
  artisan: string | null;
  matiere: string | null;
};

export type RegionVitrine = {
  nom: string;
  alias: string[];
  couleur: 'orange' | 'vert' | 'terre';
  produits: ProduitRegion[];
};

const COULEURS = {
  orange: 'bg-marque-600',
  vert: 'bg-foret-700',
  terre: 'bg-terre',
} as const;

export function VitrineRegions({ regions }: { regions: RegionVitrine[] }) {
  const [regionSelectionnee, setRegionSelectionnee] = useState(regions[0]?.nom ?? '');
  const region = regions.find((item) => item.nom === regionSelectionnee) ?? regions[0];

  const informations = useMemo(() => {
    if (!region) return { artisans: [], matieres: [], categories: [] };
    return {
      artisans: [...new Set(region.produits.map((produit) => produit.artisan).filter((valeur): valeur is string => Boolean(valeur)))],
      matieres: [...new Set(region.produits.map((produit) => produit.matiere).filter((valeur): valeur is string => Boolean(valeur)))],
      categories: [...new Set(region.produits.map((produit) => produit.categorie?.nom).filter((valeur): valeur is string => Boolean(valeur)))],
    };
  }, [region]);

  if (!region) {
    return (
      <div className="rounded-2xl border border-dashed border-marque-200 bg-white/70 p-8 text-center">
        <p className="font-titre text-xl font-bold text-terre">Les escales se préparent</p>
        <p className="mt-2 text-sm text-slate-600">Les régions apparaîtront ici au fur et à mesure que des produits avec une origine renseignée seront disponibles.</p>
      </div>
    );
  }

  const visuel = region.produits.find((produit) => produit.image)?.image;

  return (
    <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
      <nav aria-label="Choisir une région ivoirienne" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {regions.map((item, index) => {
          const selectionnee = item.nom === region.nom;
          return (
            <button
              key={item.nom}
              type="button"
              onClick={() => setRegionSelectionnee(item.nom)}
              aria-pressed={selectionnee}
              className={`region-tab flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                selectionnee
                  ? `${COULEURS[item.couleur]} text-white shadow-lg`
                  : 'bg-white/80 text-terre ring-1 ring-marque-100 hover:-translate-y-0.5 hover:ring-marque-300'
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full font-titre text-lg font-bold ${selectionnee ? 'bg-white/15' : 'bg-ivoire'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-sm font-bold">{item.nom}</span>
                <span className={`block text-xs ${selectionnee ? 'text-white/75' : 'text-slate-500'}`}>
                  {item.produits.length} article{item.produits.length > 1 ? 's' : ''}
                </span>
              </span>
              <span className="ml-auto hidden text-lg lg:inline" aria-hidden="true">→</span>
            </button>
          );
        })}
      </nav>

      <section key={region.nom} className="region-reveal min-w-0 overflow-hidden rounded-2xl bg-white shadow-carte ring-1 ring-marque-100/70">
        <div className="relative min-h-56 overflow-hidden bg-terre sm:min-h-64">
          {visuel && (
            <VisuelProduit
              src={visuel}
              alt={`Sélection de produits de ${region.nom}`}
              wrapperClassName="absolute inset-0"
              className="h-full w-full object-cover opacity-45"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-terre via-terre/80 to-transparent" />
          <div className="relative flex min-h-56 max-w-2xl flex-col justify-end p-6 text-white sm:min-h-64 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-marque-200">Étape ivoirienne · {region.produits.length} produit{region.produits.length > 1 ? 's' : ''}</span>
            <h3 className="mt-2 font-titre text-3xl font-bold sm:text-4xl">{region.nom}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
              Une sélection de produits dont l’origine indiquée sur les fiches est liée à cette escale.
            </p>
          </div>
          <div className="bande-ci absolute inset-x-0 bottom-0" />
        </div>

        <div className="grid gap-5 p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-ivoire p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Savoir-faire au catalogue</p>
              <p className="mt-2 text-sm font-semibold text-terre">{informations.categories.join(' · ') || 'À renseigner'}</p>
            </div>
            <div className="rounded-xl bg-ivoire p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Artisans / producteurs indiqués</p>
              <p className="mt-2 text-sm font-semibold text-terre">{informations.artisans.length > 0 ? informations.artisans.join(' · ') : 'À renseigner sur les fiches'}</p>
            </div>
            <div className="rounded-xl bg-ivoire p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Matières mentionnées</p>
              <p className="mt-2 text-sm font-semibold text-terre">{informations.matieres.length > 0 ? informations.matieres.slice(0, 3).join(' · ') : 'À renseigner sur les fiches'}</p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-marque-600">La sélection de l’escale</p>
                <h4 className="titre text-xl font-bold">Produits de {region.nom}</h4>
              </div>
              <p className="text-xs text-slate-500">Origines et partenaires selon les informations du catalogue.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-3">
              {region.produits.slice(0, 6).map((produit, index) => (
                <div key={produit.id} className="region-item" style={{ animationDelay: `${index * 55}ms` }}>
                  <ProduitCarte produit={produit} />
                </div>
              ))}
            </div>
            {region.produits.length > 6 && (
              <p className="mt-4 text-center text-sm text-slate-600">
                6 produits affichés sur {region.produits.length} pour cette escale.
              </p>
            )}
          </div>
        </div>
      </section>
      <p className="text-xs leading-relaxed text-slate-500 lg:col-start-2">
        Les informations sur les artisans, producteurs, origines et matières sont celles indiquées dans les fiches de démonstration du catalogue ; elles ne constituent pas une certification indépendante.
      </p>
    </div>
  );
}
