'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ConnexionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const res = await fetch('/api/auth/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse }),
    });
    const data = await res.json();
    setChargement(false);

    if (!res.ok) {
      setErreur(data.erreur ?? 'Connexion impossible.');
      return;
    }

    const suivant = params.get('suivant');
    const destination = suivant ?? (data.role === 'ADMIN' ? '/admin' : '/compte');
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="conteneur flex justify-center py-16">
      <div className="carte w-full max-w-md p-7">
        <h1 className="titre text-3xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">Accédez à votre compte pour commander et suivre vos livraisons.</p>

        <form onSubmit={soumettre} className="mt-6 space-y-4">
          <div>
            <label className="etiquette" htmlFor="email">Adresse e-mail</label>
            <input id="email" type="email" required className="champ" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" autoComplete="email" />
          </div>
          <div>
            <label className="etiquette" htmlFor="mdp">Mot de passe</label>
            <input id="mdp" type="password" required className="champ" value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>

          {erreur && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{erreur}</p>
          )}

          <button type="submit" disabled={chargement} className="bouton-primaire w-full">
            {chargement ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-100">
          <p className="font-semibold text-slate-700">Comptes de démonstration</p>
          <p>Admin : admin@kolatier.ci / Admin123!</p>
          <p>Client : client@kolatier.ci / Client123!</p>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="font-semibold text-marque-700 hover:underline">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
