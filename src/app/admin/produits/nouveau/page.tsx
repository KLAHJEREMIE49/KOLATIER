import { prisma } from '@/lib/prisma';
import { FormulaireProduit } from '@/components/admin/FormulaireProduit';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Nouveau produit' };

export default async function NouveauProduitPage() {
  const categories = await prisma.categorie.findMany({ orderBy: { nom: 'asc' } });

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Nouveau produit</h1>
      <p className="mt-1 text-sm text-slate-600">Le slug d’URL est généré automatiquement à partir du nom.</p>
      {categories.length === 0 ? (
        <p className="carte mt-5 p-5 text-sm text-slate-600">
          Créez d’abord une catégorie dans l’onglet « Catégories ».
        </p>
      ) : (
        <FormulaireProduit categories={categories} />
      )}
    </div>
  );
}
