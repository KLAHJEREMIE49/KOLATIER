'use client';

import { useMemo, useState } from 'react';
import { Etoiles } from './Etoiles';
import { formatDate } from '@/lib/utils';

export type AvisAffiche = {
  id: number;
  note: number;
  titre: string | null;
  commentaire: string;
  creeLe: string | Date;
  achatVerifie: boolean;
  auteur: string;
};

type Tri = 'recents' | 'mieux' | 'critiques' | 'utiles';

/** Bloc d'avis façon Jumia : note globale, distribution, filtres et tri. */
export function ResumeAvis({ avis, produitNom }: { avis: AvisAffiche[]; produitNom: string }) {
  const [tri, setTri] = useState<Tri>('recents');
  const [filtre, setFiltre] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = avis.length;
    const somme = avis.reduce((s, a) => s + a.note, 0);
    const moyenne = total ? somme / total : 0;
    const repartition = [5, 4, 3, 2, 1].map((n) => {
      const nb = avis.filter((a) => a.note === n).length;
      return { note: n, nb, pct: total ? Math.round((nb / total) * 100) : 0 };
    });
    const verifies = avis.filter((a) => a.achatVerifie).length;
    return { total, moyenne, repartition, verifies };
  }, [avis]);

  const liste = useMemo(() => {
    let l = [...avis];
    if (filtre !== null) l = l.filter((a) => a.note === filtre);
    if (tri === 'recents') l.sort((a, b) => +new Date(b.creeLe) - +new Date(a.creeLe));
    if (tri === 'mieux') l.sort((a, b) => b.note - a.note);
    if (tri === 'critiques') l.sort((a, b) => a.note - b.note);
    if (tri === 'utiles') l.sort((a, b) => b.commentaire.length - a.commentaire.length);
    return l;
  }, [avis, filtre, tri]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 rounded-2xl bg-white p-5 shadow-carte ring-1 ring-marque-100/70 sm:grid-cols-[auto_1fr]">
        {/* Note globale */}
        <div className="text-center sm:border-r sm:border-slate-100 sm:pr-6">
          <p className="titre text-5xl font-extrabold text-terre">{stats.moyenne.toFixed(1)}</p>
          <div className="mt-1 flex justify-center">
            <Etoiles note={stats.moyenne} taille="md" />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {stats.total} avis{stats.total > 1 ? '' : ''}
          </p>
          {stats.verifies > 0 && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-foret-50 px-2 py-0.5 text-[10px] font-bold text-foret-700">
              ✓ {stats.verifies} achats vérifiés
            </p>
          )}
        </div>

        {/* Distribution cliquable */}
        <div className="space-y-1.5">
          {stats.repartition.map((r) => (
            <button
              key={r.note}
              type="button"
              onClick={() => setFiltre(filtre === r.note ? null : r.note)}
              className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition ${
                filtre === r.note ? 'bg-marque-50 ring-1 ring-marque-200' : 'hover:bg-slate-50'
              }`}
              aria-pressed={filtre === r.note}
            >
              <span className="w-10 shrink-0 text-[11px] font-bold text-slate-600">{r.note} ★</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full rounded-full bg-amber-500" style={{ width: `${r.pct}%` }} />
              </span>
              <span className="w-14 shrink-0 text-right text-[11px] text-slate-500">
                {r.nb} · {r.pct}%
              </span>
            </button>
          ))}
          {(filtre !== null || tri !== 'recents') && (
            <button
              type="button"
              onClick={() => {
                setFiltre(null);
                setTri('recents');
              }}
              className="mt-1 text-[11px] font-bold text-marque-700 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {avis.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-terre">
            Avis sur {produitNom}
            {filtre !== null && <span className="ml-1 text-slate-500">· filtrés sur {filtre} ★</span>}
          </p>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            Trier par
            <select
              className="rounded-lg border-0 bg-white px-2 py-1.5 text-xs font-semibold ring-1 ring-marque-100 focus:ring-2 focus:ring-marque-500"
              value={tri}
              onChange={(e) => setTri(e.target.value as Tri)}
            >
              <option value="recents">Plus récents</option>
              <option value="mieux">Mieux notés</option>
              <option value="critiques">Notes les plus basses</option>
              <option value="utiles">Commentaires détaillés</option>
            </select>
          </label>
        </div>
      )}

      {liste.length === 0 ? (
        <p className="rounded-xl bg-white p-5 text-sm text-slate-600 ring-1 ring-marque-100/70">
          Aucun avis {filtre !== null ? `avec ${filtre} étoile` : ''} pour ce produit. Soyez le premier à
          partager votre expérience après réception.
        </p>
      ) : (
        <ul className="space-y-3">
          {liste.map((a) => (
            <li key={a.id} className="rounded-2xl bg-white p-4 shadow-carte ring-1 ring-marque-100/70">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-marque-100 text-xs font-extrabold text-marque-800">
                  {a.auteur.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight text-terre">{a.auteur}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Etoiles note={a.note} taille="xs" />
                    <span className="text-[10px] text-slate-400">{formatDate(a.creeLe)}</span>
                    {a.achatVerifie && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-foret-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-foret-700">
                        ✓ Achat vérifié
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {a.titre && <p className="mt-2 text-sm font-bold text-terre">{a.titre}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{a.commentaire}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
