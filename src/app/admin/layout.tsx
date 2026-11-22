import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Layout du back-office : double vérification (middleware Edge + contrôle serveur). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session) redirect('/connexion?suivant=/admin');
  if (session.role !== 'ADMIN') redirect('/');

  const liens = [
    { href: '/admin', label: 'Tableau de bord', icone: '▤' },
    { href: '/admin/produits', label: 'Produits', icone: '▣' },
    { href: '/admin/categories', label: 'Catégories', icone: '❏' },
    { href: '/admin/commandes', label: 'Commandes', icone: '⇄' },
    { href: '/admin/messages', label: 'Messages contact', icone: '✉' },
    { href: '/admin/utilisateurs', label: 'Utilisateurs', icone: '☺' },
  ];

  return (
    <div className="conteneur py-8">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="carte h-fit p-3">
          <p className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Back-office</p>
          <nav className="flex flex-col gap-0.5">
            {liens.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-marque-50 hover:text-marque-700"
              >
                <span className="text-slate-400">{l.icone}</span>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Link href="/" className="block rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:bg-slate-50">
              ← Retour à la boutique
            </Link>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
