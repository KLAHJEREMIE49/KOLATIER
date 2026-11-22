'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Categorie = { id: number; nom: string };

type Valeurs = {
  id?: number;
  nom: string;
  description: string;
  prix: string;
  stock: string;
  image: string;
  origine: string;
  artisan: string;
  matiere: string;
  categorieId: string;
  actif: boolean;
};

/** Formulaire partagé création / édition de produit. */
export function FormulaireProduit({ categories, valeurs }: { categories: Categorie[]; valeurs?: Partial<Valeurs> }) {
  const router = useRouter();
  const [form, setForm] = useState<Valeurs>({
    id: valeurs?.id,
    nom: valeurs?.nom ?? '',
    description: valeurs?.description ?? '',
    prix: valeurs?.prix ?? '',
    stock: valeurs?.stock ?? '0',
    image: valeurs?.image ?? '',
    origine: valeurs?.origine ?? '',
    artisan: valeurs?.artisan ?? '',
    matiere: valeurs?.matiere ?? '',
    categorieId: valeurs?.categorieId ?? (categories[0] ? String(categories[0].id) : ''),
    actif: valeurs?.actif ?? true,
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const creation = !form.id;

  function maj<K extends keyof Valeurs>(champ: K, valeur: Valeurs[K]) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const res = await fetch(creation ? '/api/admin/produits' : `/api/admin/produits/${form.id}`, {
      method: creation ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setChargement(false);

    if (!res.ok) {
      setErreur(data.erreur ?? 'Enregistrement impossible.');
      return;
    }
    router.push('/admin/produits');
    router.refresh();
  }

  return (
    <form onSubmit={soumettre} className="carte mt-5 space-y-4 p-5">
      <div>
        <label className="etiquette" htmlFor="nom">Nom du produit</label>
        <input id="nom" required className="champ" value={form.nom} onChange={(e) => maj('nom', e.target.value)} />
      </div>

      <div>
        <label className="etiquette" htmlFor="description">Description</label>
        <textarea id="description" required rows={5} className="champ" value={form.description}
          onChange={(e) => maj('description', e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="etiquette" htmlFor="prix">Prix (FCFA)</label>
          <input id="prix" required type="number" step="1" min="0" className="champ" value={form.prix}
            onChange={(e) => maj('prix', e.target.value)} />
        </div>
        <div>
          <label className="etiquette" htmlFor="stock">Stock</label>
          <input id="stock" required type="number" min="0" className="champ" value={form.stock}
            onChange={(e) => maj('stock', e.target.value)} />
        </div>
        <div>
          <label className="etiquette" htmlFor="cat">Catégorie</label>
          <select id="cat" required className="champ" value={form.categorieId} onChange={(e) => maj('categorieId', e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="etiquette" htmlFor="image">URL de l’image</label>
        <input id="image" className="champ" value={form.image} onChange={(e) => maj('image', e.target.value)}
          placeholder="/images/mon-produit.webp (fichier local dans public/images)" />
        <p className="mt-1 text-xs text-slate-500">Laisser vide si aucune image. Les fichiers du dossier public/ sont servis à la racine.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="etiquette" htmlFor="origine">Origine (ville/région)</label><input id="origine" className="champ" maxLength={120} value={form.origine} onChange={(e) => maj('origine', e.target.value)} placeholder="Korhogo" /></div>
        <div><label className="etiquette" htmlFor="artisan">Artisan / coopérative</label><input id="artisan" className="champ" maxLength={160} value={form.artisan} onChange={(e) => maj('artisan', e.target.value)} /></div>
        <div><label className="etiquette" htmlFor="matiere">Matière / ingrédient</label><input id="matiere" className="champ" maxLength={160} value={form.matiere} onChange={(e) => maj('matiere', e.target.value)} /></div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" checked={form.actif}
          onChange={(e) => maj('actif', e.target.checked)} />
        Produit visible dans le catalogue
      </label>

      {erreur && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{erreur}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={chargement} className="bouton-primaire">
          {chargement ? 'Enregistrement…' : creation ? 'Créer le produit' : 'Enregistrer les modifications'}
        </button>
        <button type="button" onClick={() => router.push('/admin/produits')} className="bouton-secondaire">Annuler</button>
      </div>
    </form>
  );
}
