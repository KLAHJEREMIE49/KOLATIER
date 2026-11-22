'use client';

import { useEffect, useState } from 'react';

/** Compte à rebours de fin d'offre : se termine à minuit (heure d'Abidjan). */
export function CompteARebours({ compact = false }: { compact?: boolean }) {
  const [restant, setRestant] = useState<number>(0);

  useEffect(() => {
    function calcul() {
      const maintenant = new Date();
      const fin = new Date(maintenant);
      fin.setHours(23, 59, 59, 999);
      return Math.max(0, fin.getTime() - maintenant.getTime());
    }
    setRestant(calcul());
    const id = setInterval(() => setRestant(calcul()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(restant / 3_600_000);
  const m = Math.floor((restant % 3_600_000) / 60_000);
  const s = Math.floor((restant % 60_000) / 1000);
  const bloc = (v: number) => String(v).padStart(2, '0');

  if (compact) {
    return (
      <span className="font-mono text-sm font-extrabold tabular-nums">
        {bloc(h)}:{bloc(m)}:{bloc(s)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5" aria-label="Temps restant avant la fin de l’offre">
      {[
        { v: h, l: 'H' },
        { v: m, l: 'MIN' },
        { v: s, l: 'SEC' },
      ].map((x, i) => (
        <div key={x.l} className="flex items-center gap-1.5">
          {i > 0 && <span className="pb-4 text-lg font-black text-white/70">:</span>}
          <div className="min-w-[2.6rem] rounded-lg bg-white px-1.5 py-1 text-center text-terre shadow">
            <span className="block font-mono text-lg font-extrabold leading-none tabular-nums">{bloc(x.v)}</span>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">{x.l}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
