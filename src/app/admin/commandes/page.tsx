import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, formatPrix, MODES_PAIEMENT, type ModePaiement } from '@/lib/utils';
import { SelecteurStatut } from '@/components/admin/SelecteurStatut';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Commandes' };

export default async function AdminCommandesPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  const commandes = await prisma.commande.findMany({
    where: searchParams.statut ? { statut: searchParams.statut as never } : {},
    orderBy: { creeLe: 'desc' },
    include: { utilisateur: { select: { nom: true, email: true } }, _count: { select: { lignes: true } } },
  });

  const onglets = [
    { valeur: '', label: 'Toutes' },
    { valeur: 'EN_ATTENTE', label: 'En attente' },
    { valeur: 'EXPEDIEE', label: 'Expédiées' },
    { valeur: 'LIVREE', label: 'Livrées' },
    { valeur: 'ANNULEE', label: 'Annulées' },
  ];

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Commandes</h1>
      <p className="mt-1 text-sm text-slate-600">{commandes.length} commande(s) affichée(s).</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {onglets.map((o) => (
          <Link
            key={o.valeur}
            href={o.valeur ? `/admin/commandes?statut=${o.valeur}` : '/admin/commandes'}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 transition ${
              (searchParams.statut ?? '') === o.valeur
                ? 'bg-marque-600 text-white ring-marque-600'
                : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <div className="carte mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Référence</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="hidden sm:table-cell px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="hidden lg:table-cell px-4 py-3 font-semibold">Paiement</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {commandes.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Aucune commande.</td></tr>
            )}
            {commandes.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-semibold text-terre">
                  {c.reference}
                  <p className="text-xs font-normal text-slate-500">{c._count.lignes} article(s)</p>
                </td>
                <td className="px-4 py-2.5 text-slate-600">
                  {c.utilisateur.nom}
                  <p className="text-xs text-slate-400">{c.utilisateur.email}</p>
                </td>
                <td className="hidden px-4 py-2.5 text-slate-600 sm:table-cell">{formatDate(c.creeLe)}</td>
                <td className="px-4 py-2.5 font-medium">{formatPrix(c.total)}</td>
                <td className="hidden px-4 py-2.5 text-slate-600 lg:table-cell">{MODES_PAIEMENT[c.modePaiement as ModePaiement]}</td>
                <td className="px-4 py-2.5">
                  <SelecteurStatut id={c.id} statut={c.statut} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/commandes/${c.id}`} className="text-sm font-semibold text-marque-700 hover:underline">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
