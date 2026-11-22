'use client';

import { useState } from 'react';

export function FormulaireContact() {
  const [erreur, setErreur] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? 'Votre message n’a pas pu être envoyé.');
        return;
      }
      formElement.reset();
      setEnvoye(true);
    } catch {
      setErreur('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="carte space-y-4 p-5">
      <div><label className="etiquette" htmlFor="nom">Nom</label><input id="nom" name="nom" required maxLength={100} className="champ" /></div>
      <div><label className="etiquette" htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" required maxLength={254} className="champ" /></div>
      <div><label className="etiquette" htmlFor="sujet">Sujet</label><input id="sujet" name="sujet" required maxLength={160} className="champ" /></div>
      <div><label className="etiquette" htmlFor="message">Votre message</label><textarea id="message" name="message" required minLength={10} maxLength={4000} rows={6} className="champ" /></div>
      {erreur && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{erreur}</p>}
      {envoye && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Merci, votre message a été enregistré.</p>}
      <button disabled={chargement} className="bouton-primaire">{chargement ? 'Envoi…' : 'Envoyer le message'}</button>
      <p className="text-xs text-slate-500">Projet pédagogique : ne transmettez pas d’informations sensibles.</p>
    </form>
  );
}
