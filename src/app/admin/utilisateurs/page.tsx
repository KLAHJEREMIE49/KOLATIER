import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { BoutonBlocage } from '@/components/admin/BoutonBlocage';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Utilisateurs' };

export default async function AdminUtilisateursPage() {
  const session = await getCurrentUser();
  const utilisateurs = await prisma.utilisateur.findMany({
    orderBy: { creeLe: 'desc' },
    include: { _count: { select: { commandes: true } } },
  });

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Utilisateurs</h1>
      <p className="mt-1 text-sm text-slate-600">
        {utilisateurs.length} compte(s) · bloquer un client invalide immédiatement sa session.
      </p>

      <div className="carte mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">E-mail</th>
              <th className="px-4 py-3 font-semibold">Rôle</th>
              <th className="hidden sm:table-cell px-4 py-3 font-semibold">Inscrit le</th>
              <th className="px-4 py-3 font-semibold">Commandes</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {utilisateurs.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-medium text-terre">
                  {u.nom}
                  {u.bloque && <span className="ml-2 badge bg-rose-100 text-rose-700 ring-rose-200">Bloqué</span>}
                </td>
                <td className="px-4 py-2.5 text-slate-600">{u.email}</td>
                <td className="px-4 py-2.5">
                  <span className={`badge ${u.role === 'ADMIN' ? 'bg-marque-50 text-marque-700 ring-marque-200' : 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                    {u.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 text-slate-600 sm:table-cell">{formatDate(u.creeLe)}</td>
                <td className="px-4 py-2.5 text-slate-600">{u._count.commandes}</td>
                <td className="px-4 py-2.5 text-right">
                  {u.role === 'ADMIN' ? (
                    <span className="text-xs text-slate-400">—</span>
                  ) : (
                    <BoutonBlocage id={u.id} bloque={u.bloque} soiMeme={u.id === Number(session?.sub)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
