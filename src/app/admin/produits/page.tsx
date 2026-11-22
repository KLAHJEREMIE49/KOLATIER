import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrix } from '@/lib/utils';
import { ActionsProduit } from '@/components/admin/ActionsProduit';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produits' };

export default async function AdminProduitsPage({
  searchParams,
}: {
  searchParams: { q?: string; categorie?: string };
}) {
  const produits = await prisma.produit.findMany({
    where: {
      ...(searchParams.q ? { nom: { contains: searchParams.q, mode: 'insensitive' as const } } : {}),
      ...(searchParams.categorie ? { categorie: { slug: searchParams.categorie } } : {}),
    },
    orderBy: { creeLe: 'desc' },
    include: { categorie: { select: { nom: true } }, _count: { select: { lignes: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="titre text-3xl font-bold">Produits</h1>
          <p className="mt-1 text-sm text-slate-600">{produits.length} produit(s) au total, actifs ou archivés.</p>
        </div>
        <Link href="/admin/produits/nouveau" className="bouton-primaire">+ Nouveau produit</Link>
      </div>

      <form className="carte mt-5 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[220px] flex-1">
          <label className="etiquette" htmlFor="q">Rechercher</label>
          <input id="q" name="q" defaultValue={searchParams.q ?? ''} className="champ" placeholder="Nom du produit…" />
        </div>
        <button className="bouton-secondaire">Filtrer</button>
      </form>

      <div className="carte mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Produit</th>
              <th className="px-4 py-3 font-semibold">Catégorie</th>
              <th className="px-4 py-3 font-semibold">Prix</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">État</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {produits.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Aucun produit.</td></tr>
            )}
            {produits.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/admin/produits/${p.id}`} className="font-semibold text-terre hover:text-marque-700">
                        {p.nom}
                      </Link>
                      <p className="truncate text-xs text-slate-500">{p._count.lignes} vente(s)</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{p.categorie.nom}</td>
                <td className="px-4 py-2.5 font-medium">{formatPrix(p.prix)}</td>
                <td className="px-4 py-2.5">
                  <span className={`badge ${p.stock === 0 ? 'bg-rose-100 text-rose-700 ring-rose-200' : p.stock <= 5 ? 'bg-amber-100 text-amber-800 ring-amber-200' : 'bg-emerald-100 text-emerald-800 ring-emerald-200'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`badge ${p.actif ? 'bg-slate-100 text-slate-700 ring-slate-200' : 'bg-slate-800 text-white ring-slate-800'}`}>
                    {p.actif ? 'Actif' : 'Archivé'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <ActionsProduit id={p.id} actif={p.actif} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
