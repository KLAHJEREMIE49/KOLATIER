'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

/** Boutons Modifier / Supprimer d'une ligne produit. */
export function ActionsProduit({ id, actif }: { id: number; actif: boolean }) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();

  async function supprimer() {
    if (!confirm('Supprimer ce produit ? S’il figure dans des commandes, il sera archivé.')) return;

    const res = await fetch(`/api/admin/produits/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.erreur ?? 'Suppression impossible.');
      return;
    }
    if (data.archive) alert(data.message);
    demarrer(() => router.refresh());
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/produits/${id}`} className="text-sm font-semibold text-marque-700 hover:underline">
        Modifier
      </Link>
      <button onClick={supprimer} disabled={enCours} className="text-sm font-semibold text-rose-600 hover:underline disabled:opacity-50">
        {actif ? 'Supprimer' : 'Effacer'}
      </button>
    </div>
  );
}
