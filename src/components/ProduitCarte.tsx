import Link from 'next/link';
import { formatPrix } from '@/lib/utils';
import { BoutonAjout } from './AjouterPanier';
import { VisuelProduit } from './VisuelProduit';
import { NoteCompacte } from './Etoiles';
import { BoutonFavori } from './BoutonFavori';

export type ProduitAffiche = {
  id: number;
  nom: string;
  slug: string;
  prix: string | number | { toString(): string };
  ancienPrix?: string | number | { toString(): string } | null;
  image: string | null;
  stock: number;
  categorie?: { nom: string } | null;
  avis?: { note: number }[];
  origine?: string | null;
  artisan?: string | null;
  creeLe?: Date | string;
};

const enNombre = (v: string | number | { toString(): string } | null | undefined) =>
  v === null || v === undefined ? null : Number(v.toString());

/** Carte produit façon Jumia : photo réelle plein cadre, note étoilée, prix, urgence. */
export function ProduitCarte({ produit }: { produit: ProduitAffiche }) {
  const enRupture = produit.stock <= 0;
  const nombreAvis = produit.avis?.length ?? 0;
  const note = nombreAvis ? (produit.avis ?? []).reduce((s, a) => s + a.note, 0) / nombreAvis : 0;
  const recent =
    produit.creeLe !== undefined && Date.now() - new Date(produit.creeLe).getTime() < 1000 * 60 * 60 * 24 * 45;
  const populaire = nombreAvis >= 3 && note >= 4;
  const prix = enNombre(produit.prix) ?? 0;
  const ancien = enNombre(produit.ancienPrix);
  const remise = ancien && ancien > prix ? Math.round(((ancien - prix) / ancien) * 100) : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-carte ring-1 ring-marque-100/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-premium hover:ring-marque-300/70">
      <Link href={`/produits/${produit.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <VisuelProduit
          src={produit.image}
          alt={produit.nom}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute left-2 right-12 top-2 flex flex-wrap gap-1.5">
          {remise > 0 && (
            <span className="rounded-full bg-rose-600 px-2 py-1 text-[11px] font-extrabold text-white shadow-lg">
              -{remise}%
            </span>
          )}
          {enRupture ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-rose-700 shadow">Épuisé</span>
          ) : (
            <>
              {recent && <span className="rounded-full bg-foret-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">Nouveau</span>}
              {populaire && <span className="rounded-full bg-marque-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">★ Populaire</span>}
            </>
          )}
        </div>
        <div className="absolute right-2 top-2">
          <BoutonFavori
            produit={{ produitId: produit.id, nom: produit.nom, slug: produit.slug, prix, image: produit.image, stock: produit.stock }}
          />
        </div>
        {produit.origine && (
          <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-terre/75 px-2.5 py-1 text-[11px] font-semibold text-ivoire backdrop-blur">
            ⌖ {produit.origine}
          </span>
        )}
        {!enRupture && produit.stock <= 5 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-amber-400/95 px-2 py-1 text-[10px] font-extrabold text-terre shadow">
            Plus que {produit.stock}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        {produit.categorie && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-marque-600">{produit.categorie.nom}</p>
        )}
        <Link href={`/produits/${produit.slug}`} className="line-clamp-2 text-sm font-bold leading-snug text-terre hover:text-marque-700">
          {produit.nom}
        </Link>

        <div className="mt-0.5">
          <NoteCompacte moyenne={note} total={nombreAvis} taille="xs" />
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <p className="text-lg font-extrabold text-marque-700">{formatPrix(prix)}</p>
          {ancien && ancien > prix && (
            <p className="text-xs font-semibold text-slate-400 line-through">{formatPrix(ancien)}</p>
          )}
        </div>

        <div className="mt-auto pt-2.5">
          <BoutonAjout
            produit={{
              produitId: produit.id,
              nom: produit.nom,
              slug: produit.slug,
              prix,
              image: produit.image,
              stock: produit.stock,
            }}
          />
        </div>
      </div>
    </article>
  );
}
