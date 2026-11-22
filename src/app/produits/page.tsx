import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProduitCarte } from '@/components/ProduitCarte';
import { Filtres } from '@/components/Filtres';

export const dynamic = 'force-dynamic';

type Params = {
  q?: string;
  categorie?: string;
  origine?: string;
  min?: string;
  max?: string;
  tri?: string;
  stock?: string;
};

export const metadata = { title: 'Catalogue' };

export default async function CataloguePage({ searchParams }: { searchParams: Params }) {
  const { q, categorie, origine, min, max, tri, stock } = searchParams;

  const where: Prisma.ProduitWhereInput = { actif: true };
  if (q?.trim()) {
    where.OR = [
      { nom: { contains: q.trim(), mode: 'insensitive' } },
      { description: { contains: q.trim(), mode: 'insensitive' } },
      { origine: { contains: q.trim(), mode: 'insensitive' } },
      { artisan: { contains: q.trim(), mode: 'insensitive' } },
      { matiere: { contains: q.trim(), mode: 'insensitive' } },
    ];
  }
  if (categorie) where.categorie = { slug: categorie };
  if (origine) where.origine = { contains: origine, mode: 'insensitive' };
  if (stock === 'disponible') where.stock = { gt: 0 };
  // Filtre « Promos » utilisé par le menu principal
  if (tri === 'promo') where.ancienPrix = { not: null };

  const minValide = min && /^\d+$/.test(min) && Number.isSafeInteger(Number(min)) ? Number(min) : undefined;
  const maxValide = max && /^\d+$/.test(max) && Number.isSafeInteger(Number(max)) ? Number(max) : undefined;
  const prixInvalide = Boolean(
    (min && minValide === undefined) ||
    (max && maxValide === undefined) ||
    (minValide !== undefined && maxValide !== undefined && minValide > maxValide),
  );
  if (!prixInvalide && (minValide !== undefined || maxValide !== undefined)) {
    where.prix = {};
    if (minValide !== undefined) where.prix.gte = new Prisma.Decimal(minValide);
    if (maxValide !== undefined) where.prix.lte = new Prisma.Decimal(maxValide);
  }

  const orderBy: Prisma.ProduitOrderByWithRelationInput =
    tri === 'prix-asc' ? { prix: 'asc' }
    : tri === 'prix-desc' ? { prix: 'desc' }
    : tri === 'nom' ? { nom: 'asc' }
    : { creeLe: 'desc' };

  const [produits, categories, originesDb] = await Promise.all([
    prisma.produit.findMany({
      where,
      orderBy,
      include: { categorie: { select: { nom: true } }, avis: { select: { note: true } } },
    }),
    prisma.categorie.findMany({
      where: { produits: { some: { actif: true } } },
      orderBy: { nom: 'asc' },
    }),
    prisma.produit.findMany({
      where: { actif: true, origine: { not: null } },
      select: { origine: true },
      distinct: ['origine'],
      orderBy: { origine: 'asc' },
    }),
  ]);
  const origines = originesDb.map((produit) => produit.origine).filter((valeur): valeur is string => valeur !== null);

  const filtresActifs = [q, categorie, origine, min, max, stock].filter(Boolean).length;

  return (
    <div className="conteneur py-10">
      <header className="mb-6">
        <h1 className="titre text-3xl font-bold">Catalogue</h1>
        <p className="mt-1 text-sm text-slate-600">
          {produits.length} produit{produits.length > 1 ? 's' : ''} trouvé{produits.length > 1 ? 's' : ''}
          {filtresActifs > 0 && ` · ${filtresActifs} filtre${filtresActifs > 1 ? 's' : ''} appliqué${filtresActifs > 1 ? 's' : ''}`}
        </p>
      </header>

      <Filtres categories={categories} origines={origines} />
      {prixInvalide && (
        <p role="status" className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          La fourchette de prix est invalide. Indiquez des montants entiers en FCFA, avec le minimum inférieur ou égal au maximum.
        </p>
      )}

      {produits.length === 0 ? (
        <div className="carte mt-6 p-8 text-center">
          <p className="font-titre text-xl font-bold text-terre">Aucun produit ne correspond à cette recherche.</p>
          <p className="mt-2 text-sm text-slate-600">Essayez une autre ville ivoirienne, un artisan ou une matière, ou retirez certains filtres.</p>
          <Link href="/produits" className="bouton-primaire mt-5">Réinitialiser la recherche</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {produits.map((p) => (
            <ProduitCarte key={p.id} produit={p} />
          ))}
        </div>
      )}
    </div>
  );
}
