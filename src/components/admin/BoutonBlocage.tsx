'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** Bouton bloquer / débloquer un compte client. */
export function BoutonBlocage({ id, bloque, soiMeme }: { id: number; bloque: boolean; soiMeme: boolean }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  if (soiMeme) return <span className="text-xs text-slate-400">Vous</span>;

  async function basculer() {
    setEnCours(true);
    const res = await fetch(`/api/admin/utilisateurs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bloque: !bloque }),
    });
    const data = await res.json();
    setEnCours(false);
    if (!res.ok) { alert(data.erreur ?? 'Action impossible.'); return; }
    router.refresh();
  }

  return (
    <button
      onClick={basculer}
      disabled={enCours}
      className={`text-sm font-semibold hover:underline disabled:opacity-50 ${bloque ? 'text-emerald-700' : 'text-rose-600'}`}
    >
      {bloque ? 'Débloquer' : 'Bloquer'}
    </button>
  );
}
