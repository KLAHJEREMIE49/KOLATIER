'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Categorie = { id: number; nom: string; slug: string; nbProduits: number };

/** CRUD des catégories côté client (création, renommage, suppression). */
export function GestionCategories({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');
  const [edition, setEdition] = useState<{ id: number; nom: string } | null>(null);

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom }),
    });
    const data = await res.json();
    if (!res.ok) { setErreur(data.erreur ?? 'Création impossible.'); return; }
    setNom('');
    router.refresh();
  }

  async function renommer() {
    if (!edition) return;
    setErreur('');
    const res = await fetch(`/api/admin/categories/${edition.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: edition.nom }),
    });
    const data = await res.json();
    if (!res.ok) { setErreur(data.erreur ?? 'Renommage impossible.'); return; }
    setEdition(null);
    router.refresh();
  }

  async function supprimer(id: number) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    setErreur('');
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { setErreur(data.erreur ?? 'Suppression impossible.'); return; }
    router.refresh();
  }

  return (
    <>
      <form onSubmit={creer} className="carte mt-5 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[240px] flex-1">
          <label className="etiquette" htmlFor="nom">Nouvelle catégorie</label>
          <input id="nom" required className="champ" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Luminaires" />
        </div>
        <button className="bouton-primaire">Créer</button>
      </form>

      {erreur && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{erreur}</p>}

      <div className="carte mt-5 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Produits</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-medium text-terre">
                  {edition?.id === c.id ? (
                    <input className="champ py-1.5" value={edition.nom}
                      onChange={(e) => setEdition({ id: c.id, nom: e.target.value })} autoFocus />
                  ) : c.nom}
                </td>
                <td className="px-4 py-2.5 text-slate-500"><code className="text-xs">{c.slug}</code></td>
                <td className="px-4 py-2.5 text-slate-600">{c.nbProduits}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex justify-end gap-2">
                    {edition?.id === c.id ? (
                      <>
                        <button onClick={renommer} className="text-sm font-semibold text-emerald-700 hover:underline">Valider</button>
                        <button onClick={() => setEdition(null)} className="text-sm text-slate-500 hover:underline">Annuler</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEdition({ id: c.id, nom: c.nom })} className="text-sm font-semibold text-marque-700 hover:underline">Renommer</button>
                        <button onClick={() => supprimer(c.id)} className="text-sm font-semibold text-rose-600 hover:underline">Supprimer</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
