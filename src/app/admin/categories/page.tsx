import { prisma } from '@/lib/prisma';
import { GestionCategories } from '@/components/admin/GestionCategories';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Catégories' };

export default async function AdminCategoriesPage() {
  const categories = await prisma.categorie.findMany({
    orderBy: { nom: 'asc' },
    include: { _count: { select: { produits: true } } },
  });

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Catégories</h1>
      <p className="mt-1 text-sm text-slate-600">
        Une catégorie contenant des produits ne peut pas être supprimée (intégrité référentielle).
      </p>
      <GestionCategories
        categories={categories.map((c) => ({ id: c.id, nom: c.nom, slug: c.slug, nbProduits: c._count.produits }))}
      />
    </div>
  );
}
