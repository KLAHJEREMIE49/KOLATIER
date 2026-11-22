import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatDate, formatPrix } from '@/lib/utils';
import { FormulaireProfil } from '@/components/ProfilForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mon profil' };

export default async function ComptePage() {
  const session = await getCurrentUser();
  if (!session) redirect('/connexion?suivant=/compte');

  const [utilisateur, nbCommandes] = await Promise.all([
    prisma.utilisateur.findUnique({ where: { id: Number(session.sub) } }),
    prisma.commande.count({ where: { utilisateurId: Number(session.sub) } }),
  ]);

  if (!utilisateur) redirect('/connexion');

  const totalDepense = await prisma.commande.aggregate({
    where: { utilisateurId: utilisateur.id, statut: { not: 'ANNULEE' } },
    _sum: { total: true },
  });

  return (
    <div className="conteneur py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="titre text-3xl font-bold">Bonjour {utilisateur.nom}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Membre depuis le {formatDate(utilisateur.creeLe)} · {utilisateur.role === 'ADMIN' ? 'Administrateur' : 'Client'}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="carte px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">Commandes</p>
            <p className="text-xl font-bold text-terre">{nbCommandes}</p>
          </div>
          <div className="carte px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total dépensé</p>
            <p className="text-xl font-bold text-terre">
              {formatPrix(Number(totalDepense._sum.total ?? 0))}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FormulaireProfil nom={utilisateur.nom} email={utilisateur.email} />

        <div className="carte p-5">
          <h2 className="font-bold text-terre">Sécurité</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>✓ Mot de passe stocké sous forme de hash bcrypt (coût 10)</li>
            <li>✓ Session JWT signée HS256, cookie httpOnly</li>
            <li>✓ Expiration de la session après 7 jours</li>
            <li>✓ Routes protégées par middleware côté Edge</li>
            <li>✓ Comptes bloqués : session invalidée à la requête suivante</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
