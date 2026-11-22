import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatDate, formatPrix, MODES_PAIEMENT, STATUTS, type ModePaiement, type Statut } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mes commandes' };

export default async function MesCommandesPage() {
  const session = await getCurrentUser();
  if (!session) redirect('/connexion?suivant=/commandes');

  const commandes = await prisma.commande.findMany({
    where: { utilisateurId: Number(session.sub) },
    orderBy: { creeLe: 'desc' },
    include: { _count: { select: { lignes: true } } },
  });

  return (
    <div className="conteneur py-10">
      <h1 className="titre text-3xl font-bold">Mes commandes</h1>
      <p className="mt-1 text-sm text-slate-600">Historique de vos achats et suivi des statuts.</p>

      {commandes.length === 0 ? (
        <div className="carte mt-6 p-10 text-center">
          <p className="text-slate-600">Vous n&apos;avez encore passé aucune commande.</p>
          <Link href="/produits" className="bouton-primaire mt-5">Découvrir le catalogue</Link>
        </div>
      ) : (
        <div className="carte mt-6 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Référence</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="hidden sm:table-cell px-4 py-3 font-semibold">Articles</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="hidden md:table-cell px-4 py-3 font-semibold">Paiement</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commandes.map((c) => {
                const s = STATUTS[c.statut as Statut];
                return (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-terre">{c.reference}</td>
                    <td className="px-4 py-2.5 text-slate-600">{formatDate(c.creeLe)}</td>
                    <td className="hidden px-4 py-2.5 text-slate-600 sm:table-cell">{c._count.lignes}</td>
                    <td className="px-4 py-2.5 font-medium">{formatPrix(c.total)}</td>
                    <td className="px-4 py-2.5"><span className={`badge ${STATUTS[c.statut as Statut].classe}`}>{STATUTS[c.statut as Statut].label}</span></td>
                    <td className="hidden px-4 py-2.5 text-slate-600 md:table-cell">{MODES_PAIEMENT[c.modePaiement as ModePaiement]}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Link href={`/commandes/${c.id}`} className="text-sm font-semibold text-marque-700 hover:underline">Détail</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
