import Link from 'next/link';

export type CategorieIcone = {
  id: number;
  nom: string;
  slug: string;
  nbProduits: number;
};

const VISUELS: Record<string, { emoji: string; fond: string; texte: string }> = {
  epicerie: { emoji: '🧺', fond: 'from-marque-50 to-marque-100', texte: 'text-marque-800' },
  'plats-ivoiriens': { emoji: '🍲', fond: 'from-amber-50 to-amber-100', texte: 'text-amber-900' },
  'mode-pagnes': { emoji: '🧵', fond: 'from-rose-50 to-rose-100', texte: 'text-rose-900' },
  artisanat: { emoji: '🪘', fond: 'from-foret-50 to-foret-100', texte: 'text-foret-800' },
  beaute: { emoji: '🧴', fond: 'from-lime-50 to-lime-100', texte: 'text-lime-900' },
  maison: { emoji: '🏠', fond: 'from-stone-100 to-stone-200', texte: 'text-stone-800' },
};

/** Catégories en cartes-icônes cliquables (grille responsive). */
export function GrilleCategories({ categories }: { categories: CategorieIcone[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="conteneur py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-marque-600">Nos univers</p>
          <h2 className="titre mt-1 text-2xl font-extrabold sm:text-3xl">Faites votre marché par univers</h2>
        </div>
        <Link href="/produits" className="text-sm font-bold text-marque-700 hover:underline">
          Tout le catalogue →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
        {categories.map((c) => {
          const v = VISUELS[c.slug] ?? { emoji: '🇨🇮', fond: 'from-marque-50 to-marque-100', texte: 'text-marque-800' };
          return (
            <Link
              key={c.id}
              href={`/produits?categorie=${c.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-carte ring-1 ring-marque-100/70 transition hover:-translate-y-1 hover:shadow-premium hover:ring-marque-300"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-2xl transition group-hover:scale-110 ${v.fond}`}
                aria-hidden="true"
              >
                {v.emoji}
              </span>
              <span className={`text-[12px] font-extrabold leading-tight ${v.texte}`}>{c.nom}</span>
              <span className="text-[10px] font-semibold text-slate-400">{c.nbProduits} articles</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
