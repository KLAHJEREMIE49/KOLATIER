import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, formatPrix, STATUTS, type Statut } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Tableau de bord' };

export default async function AdminDashboard() {
  const [nbCommandes, nbProduits, nbClients, ca, enAttente, recentes, stockFaible, ventesVilles, quantitesProduits] = await Promise.all([
    prisma.commande.count(),
    prisma.produit.count({ where: { actif: true } }),
    prisma.utilisateur.count({ where: { role: 'CLIENT' } }),
    prisma.commande.aggregate({ where: { statut: { not: 'ANNULEE' } }, _sum: { total: true } }),
    prisma.commande.count({ where: { statut: 'EN_ATTENTE' } }),
    prisma.commande.findMany({
      orderBy: { creeLe: 'desc' },
      take: 6,
      include: { utilisateur: { select: { nom: true } }, _count: { select: { lignes: true } } },
    }),
    prisma.produit.findMany({ where: { actif: true, stock: { lte: 5 } }, orderBy: { stock: 'asc' }, take: 6 }),
    prisma.commande.groupBy({
      by: ['ville'],
      where: { statut: { not: 'ANNULEE' } },
      _sum: { total: true },
      _count: { _all: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 5,
    }),
    prisma.ligneCommande.groupBy({
      by: ['produitId'],
      where: { commande: { statut: { not: 'ANNULEE' } } },
      _sum: { quantite: true },
      orderBy: { _sum: { quantite: 'desc' } },
      take: 5,
    }),
  ]);
  const produitsVendus = await prisma.produit.findMany({
    where: { id: { in: quantitesProduits.map((p) => p.produitId) } },
    select: { id: true, nom: true },
  });
  const nomParId = new Map(produitsVendus.map((p) => [p.id, p.nom]));

  const cartes = [
    { label: 'Chiffre d’affaires simulé', valeur: formatPrix(ca._sum.total ?? 0), aide: 'hors annulations · aucun paiement réel', accent: 'text-marque-700' },
    { label: 'Commandes', valeur: String(nbCommandes), aide: `${enAttente} en attente`, accent: 'text-terre' },
    { label: 'Produits actifs', valeur: String(nbProduits), aide: `${stockFaible.length} en stock faible`, accent: 'text-terre' },
    { label: 'Clients', valeur: String(nbClients), aide: 'comptes clients', accent: 'text-terre' },
  ];

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-slate-600">Vue d’ensemble de l’activité de la boutique.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cartes.map((c) => (
          <div key={c.label} className="carte p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
            <p className={`mt-2 text-2xl font-extrabold ${c.accent}`}>{c.valeur}</p>
            <p className="mt-0.5 text-xs text-slate-400">{c.aide}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="carte overflow-hidden lg:col-span-2">
          <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="font-bold text-terre">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-sm font-semibold text-marque-700 hover:underline">Tout voir</Link>
          </header>
          {recentes.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Aucune commande pour le moment.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <tbody className="divide-y divide-slate-100">
                {commandesRows(recentes)}
              </tbody>
            </table>
          )}
        </section>

        <section className="carte overflow-hidden">
          <header className="border-b border-slate-100 px-4 py-3">
            <h2 className="font-bold text-terre">Stocks à surveiller</h2>
          </header>
          {stockFaible.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Tous les stocks sont confortables.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stockFaible.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <Link href={`/admin/produits/${p.id}`} className="min-w-0 truncate font-medium text-slate-800 hover:text-marque-700">
                    {p.nom}
                  </Link>
                  <span className={`badge ${p.stock === 0 ? 'bg-rose-100 text-rose-700 ring-rose-200' : 'bg-amber-100 text-amber-800 ring-amber-200'}`}>
                    {p.stock} restant{p.stock > 1 ? 's' : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-slate-100 p-3">
            <Link href="/admin/produits/nouveau" className="bouton-primaire w-full">+ Nouveau produit</Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="carte overflow-hidden">
              <header className="border-b border-slate-100 px-4 py-3"><h2 className="font-bold text-terre">Ventes simulées par ville</h2></header>
              {ventesVilles.length === 0 ? <p className="p-5 text-sm text-slate-500">Aucune vente enregistrée.</p> : (
                <ul className="divide-y divide-slate-100">
                  {ventesVilles.map((vente) => <li key={vente.ville} className="flex justify-between gap-3 px-4 py-3 text-sm"><span>{vente.ville} · {vente._count._all} commande(s)</span><strong>{formatPrix(vente._sum.total ?? 0)}</strong></li>)}
                </ul>
              )}
            </section>
            <section className="carte overflow-hidden">
              <header className="border-b border-slate-100 px-4 py-3"><h2 className="font-bold text-terre">Produits les plus vendus</h2></header>
              {quantitesProduits.length === 0 ? <p className="p-5 text-sm text-slate-500">Aucune vente enregistrée.</p> : (
                <ol className="divide-y divide-slate-100">
                  {quantitesProduits.map((vente) => <li key={vente.produitId} className="flex justify-between gap-3 px-4 py-3 text-sm"><span>{nomParId.get(vente.produitId) ?? `Produit #${vente.produitId}`}</span><strong>{vente._sum.quantite ?? 0} vendu(s)</strong></li>)}
                </ol>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Petite fabrique de lignes pour le tableau des dernières commandes. */
function commandesRows(commandes: {
  id: number;
  reference: string;
  total: unknown;
  statut: string;
  creeLe: Date;
  utilisateur: { nom: string };
  _count: { lignes: number };
}[]) {
  return commandes.map((c) => (
    <tr key={c.id} className="hover:bg-slate-50/60">
      <td className="px-4 py-2.5">
        <Link href={`/commandes/${c.id}`} className="font-semibold text-terre hover:text-marque-700">
          {c.reference}
        </Link>
        <p className="text-xs text-slate-500">{c.utilisateur.nom} · {c._count.lignes} article(s)</p>
      </td>
      <td className="hidden px-4 py-2.5 text-slate-600 sm:table-cell">{formatDate(c.creeLe)}</td>
      <td className="px-4 py-2.5 font-medium">{formatPrix(c.total as string)}</td>
      <td className="px-4 py-2.5 text-right">
        <span className={`badge ${STATUTS[c.statut as Statut].classe}`}>{STATUTS[c.statut as Statut].label}</span>
      </td>
    </tr>
  ));
}
