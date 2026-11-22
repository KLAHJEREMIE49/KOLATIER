'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '', confirmation: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  function maj(champ: keyof typeof form, valeur: string) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');

    if (form.motDePasse !== form.confirmation) {
      setErreur('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);
    const res = await fetch('/api/auth/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: form.nom, email: form.email, motDePasse: form.motDePasse }),
    });
    const data = await res.json();
    setChargement(false);

    if (!res.ok) {
      setErreur(data.erreur ?? 'Inscription impossible.');
      return;
    }
    router.push('/compte');
    router.refresh();
  }

  return (
    <div className="conteneur flex justify-center py-16">
      <div className="carte w-full max-w-md p-7">
        <h1 className="titre text-3xl font-bold">Créer un compte</h1>
        <p className="mt-1 text-sm text-slate-600">Vos mots de passe sont hachés avec bcrypt avant stockage.</p>

        <form onSubmit={soumettre} className="mt-6 space-y-4">
          <div>
            <label className="etiquette" htmlFor="nom">Nom complet</label>
            <input id="nom" required className="champ" value={form.nom} onChange={(e) => maj('nom', e.target.value)} placeholder="Camille Martin" />
          </div>
          <div>
            <label className="etiquette" htmlFor="email">Adresse e-mail</label>
            <input id="email" type="email" required className="champ" value={form.email} onChange={(e) => maj('email', e.target.value)} placeholder="vous@exemple.fr" />
          </div>
          <div>
            <label className="etiquette" htmlFor="mdp">Mot de passe (6 caractères min.)</label>
            <input id="mdp" type="password" required minLength={6} className="champ" value={form.motDePasse} onChange={(e) => maj('motDePasse', e.target.value)} />
          </div>
          <div>
            <label className="etiquette" htmlFor="conf">Confirmation</label>
            <input id="conf" type="password" required className="champ" value={form.confirmation} onChange={(e) => maj('confirmation', e.target.value)} />
          </div>

          {erreur && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{erreur}</p>}

          <button type="submit" disabled={chargement} className="bouton-primaire w-full">
            {chargement ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Déjà inscrit ?{' '}
          <Link href="/connexion" className="font-semibold text-marque-700 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
