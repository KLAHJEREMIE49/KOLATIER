'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** Formulaire de modification du profil (nom, e-mail, mot de passe). */
export function FormulaireProfil({ nom: nomInitial, email: emailInitial }: { nom: string; email: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: nomInitial,
    email: emailInitial,
    motDePasseActuel: '',
    nouveauMotDePasse: '',
  });
  const [message, setMessage] = useState<{ type: 'ok' | 'erreur'; texte: string } | null>(null);
  const [chargement, setChargement] = useState(false);

  function maj(champ: keyof typeof form, valeur: string) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setChargement(true);

    const res = await fetch('/api/compte', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setChargement(false);

    if (!res.ok) {
      setMessage({ type: 'erreur', texte: data.erreur ?? 'Modification impossible.' });
      return;
    }

    setMessage({ type: 'ok', texte: 'Profil mis à jour.' });
    setForm((f) => ({ ...f, motDePasseActuel: '', nouveauMotDePasse: '' }));
    router.refresh();
  }

  return (
    <form onSubmit={soumettre} className="carte space-y-4 p-5">
      <h2 className="font-bold text-terre">Mes informations</h2>

      <div>
        <label className="etiquette" htmlFor="nom">Nom complet</label>
        <input id="nom" required className="champ" value={form.nom} onChange={(e) => maj('nom', e.target.value)} />
      </div>
      <div>
        <label className="etiquette" htmlFor="email">Adresse e-mail</label>
        <input id="email" type="email" required className="champ" value={form.email} onChange={(e) => maj('email', e.target.value)} />
      </div>

      <fieldset className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Changer de mot de passe (optionnel)
        </legend>
        <div className="mt-2 space-y-3">
          <div>
            <label className="etiquette" htmlFor="actuel">Mot de passe actuel</label>
            <input id="actuel" type="password" className="champ" value={form.motDePasseActuel}
              onChange={(e) => maj('motDePasseActuel', e.target.value)} />
          </div>
          <div>
            <label className="etiquette" htmlFor="nouveau">Nouveau mot de passe</label>
            <input id="nouveau" type="password" minLength={6} className="champ" value={form.nouveauMotDePasse}
              onChange={(e) => maj('nouveauMotDePasse', e.target.value)} />
          </div>
        </div>
      </fieldset>

      {message && (
        <p className={`rounded-lg px-3 py-2 text-sm ring-1 ${message.type === 'ok'
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-rose-50 text-rose-700 ring-rose-200'}`}>
          {message.texte}
        </p>
      )}

      <button type="submit" disabled={chargement} className="bouton-primaire">
        {chargement ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
