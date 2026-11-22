import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { FormulaireProduit } from '@/components/admin/FormulaireProduit';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function EditionProduitPage({ params }: { params: { id: string } }) {
  const [produit, categories] = await Promise.all([
    prisma.produit.findUnique({ where: { id: Number(params.id) }, include: { _count: { select: { lignes: true } } } }),
    prisma.categorie.findMany({ orderBy: { nom: 'asc' } }),
  ]);

  if (!produit) notFound();

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Modifier « {produit.nom} »</h1>
      <p className="mt-1 text-sm text-slate-600">
        Créé le {formatDate(produit.creeLe)} · {produit._count.lignes} ligne(s) de commande liée(s) ·
        slug : <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{produit.slug}</code>
      </p>

      <FormulaireProduit
        categories={categories}
        valeurs={{
          id: produit.id,
          nom: produit.nom,
          description: produit.description,
          prix: String(produit.prix),
          stock: String(produit.stock),
          image: produit.image ?? '',
          origine: produit.origine ?? '',
          artisan: produit.artisan ?? '',
          matiere: produit.matiere ?? '',
          categorieId: String(produit.categorieId),
          actif: produit.actif,
        }}
      />
    </div>
  );
}
