'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { STATUTS, type Statut } from '@/lib/utils';

const ORDRE: Statut[] = ['EN_ATTENTE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

/** Menu déroulant de changement de statut d'une commande. */
export function SelecteurStatut({ id, statut }: { id: number; statut: string }) {
  const router = useRouter();
  const [valeur, setValeur] = useState(statut);
  const [enCours, setEnCours] = useState(false);

  async function changer(nouveau: string) {
    if (nouveau === valeur) return;
    if (nouveau === 'ANNULEE' && !confirm('Annuler la commande et remettre les articles en stock ?')) return;

    setEnCours(true);
    const res = await fetch(`/api/admin/commandes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: nouveau }),
    });
    const data = await res.json();
    setEnCours(false);

    if (!res.ok) {
      alert(data.erreur ?? 'Changement impossible.');
      return;
    }
    setValeur(nouveau);
    router.refresh();
  }

  return (
    <select
      value={valeur}
      disabled={enCours}
      onChange={(e) => changer(e.target.value)}
      className={`rounded-lg border-0 px-2.5 py-1 text-xs font-semibold ring-1 ${STATUTS[valeur as Statut].classe} disabled:opacity-60`}
    >
      {ORDRE.map((s) => (
        <option key={s} value={s}>{STATUTS[s].label}</option>
      ))}
    </select>
  );
}
