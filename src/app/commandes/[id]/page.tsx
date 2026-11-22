import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatDate, formatPrix, MODES_PAIEMENT, STATUTS, type ModePaiement, type Statut } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DetailCommandePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { nouvelle?: string };
}) {
  const session = await getCurrentUser();
  if (!session) redirect('/connexion');

  const commande = await prisma.commande.findUnique({
    where: { id: Number(params.id) },
    include: { lignes: true, utilisateur: { select: { nom: true, email: true } } },
  });

  if (!commande) notFound();

  // Un client ne peut consulter que ses propres commandes ; l'admin voit tout.
  if (session.role !== 'ADMIN' && commande.utilisateurId !== Number(session.sub)) notFound();

  const statut = STATUTS[commande.statut as Statut];
  const sousTotal = commande.lignes.reduce((t, l) => t + Number(l.prixUnitaire) * l.quantite, 0);
  const fraisPort = Number(commande.total) - sousTotal;

  const etapes: Statut[] = ['EN_ATTENTE', 'EXPEDIEE', 'LIVREE'];
  const indexActuel = etapes.indexOf(commande.statut as Statut);

  return (
    <div className="conteneur py-10">
      {searchParams.nouvelle === '1' && (
        <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
          ✓ Merci ! Votre commande <strong>{commande.reference}</strong> a bien été enregistrée.
        </div>
      )}

      <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/commandes" className="hover:text-marque-700">Mes commandes</Link>
        <span>/</span>
        <span className="text-slate-700">{commande.reference}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="titre text-3xl font-bold">{commande.reference}</h1>
          <p className="mt-1 text-sm text-slate-600">Passée le {formatDate(commande.creeLe)}</p>
        </div>
        <span className={`badge ${statut.classe}`}>{statut.label}</span>
      </div>

      {/* Suivi visuel */}
      {commande.statut !== 'ANNULEE' && (
        <ol className="mt-6 grid grid-cols-3 gap-2">
          {etapes.map((e, i) => {
            const fait = i <= indexActuel;
            return (
              <li key={e} className="flex flex-col gap-2">
                <div className={`h-1.5 rounded-full ${fait ? 'bg-marque-600' : 'bg-slate-200'}`} />
                <span className={`text-xs font-semibold ${fait ? 'text-marque-700' : 'text-slate-400'}`}>
                  {STATUTS[e].label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="carte overflow-hidden lg:col-span-2">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Produit</th>
                <th className="px-4 py-3 font-semibold">Prix unitaire</th>
                <th className="px-4 py-3 font-semibold">Qté</th>
                <th className="px-4 py-3 text-right font-semibold">Sous-total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commande.lignes.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium text-terre">{l.nomProduit}</td>
                  <td className="px-4 py-3 text-slate-600">{formatPrix(l.prixUnitaire)}</td>
                  <td className="px-4 py-3 text-slate-600">{l.quantite}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPrix(Number(l.prixUnitaire) * l.quantite)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 text-sm">
              <tr>
                <td colSpan={3} className="px-4 py-2.5 text-right text-slate-600">Livraison</td>
                <td className="px-4 py-2.5 text-right">{fraisPort <= 0 ? 'Offerte' : formatPrix(fraisPort)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-bold text-terre">Total payé</td>
                <td className="px-4 py-3 text-right text-base font-bold text-terre">{formatPrix(commande.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <aside className="carte h-fit p-5 text-sm">
          <h2 className="font-bold text-terre">Adresse de livraison</h2>
          <p className="mt-2 text-sm text-slate-600">Paiement : {MODES_PAIEMENT[commande.modePaiement as ModePaiement]} (simulé)</p>
          <address className="mt-2 not-italic leading-relaxed text-slate-600">
            {commande.utilisateur.nom}<br />
            {commande.adresseLivraison}<br />
            {commande.codePostal} {commande.ville}<br />
            Tél. {commande.telephone}
          </address>
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            Les prix et le nom des produits sont figés au moment de la commande : une modification
            ultérieure du catalogue ne change pas cet historique.
          </p>
        </aside>
      </div>
    </div>
  );
}
