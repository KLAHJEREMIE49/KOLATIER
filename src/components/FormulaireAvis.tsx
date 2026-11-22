'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LIBELLES = ['', 'Très mauvais', 'Mauvais', 'Moyen', 'Bien', 'Excellent'];

/** Formulaire d'avis façon Jumia : étoiles cliquables, titre, commentaire. */
export function FormulaireAvis({ produitId }: { produitId: number }) {
  const router = useRouter();
  const [note, setNote] = useState(5);
  const [survol, setSurvol] = useState(0);
  const [titre, setTitre] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [erreur, setErreur] = useState('');
  const [ok, setOk] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produitId, note, titre, commentaire }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? 'Votre avis n’a pas pu être enregistré.');
        return;
      }
      setOk(true);
      setTitre('');
      setCommentaire('');
      router.refresh();
    } catch {
      setErreur('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setChargement(false);
    }
  }

  if (ok) {
    return (
      <div className="mt-5 rounded-2xl bg-foret-50 p-5 text-center ring-1 ring-foret-200">
        <p className="text-sm font-bold text-foret-800">✓ Merci, votre avis est publié</p>
        <p className="mt-1 text-xs text-foret-700">Il apparaît désormais dans la liste ci-dessus.</p>
      </div>
    );
  }

  return (
    <form onSubmit={soumettre} className="mt-5 space-y-4 rounded-2xl bg-white p-5 shadow-carte ring-1 ring-marque-100/70">
      <div>
        <h3 className="font-bold text-terre">Donnez votre avis</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Vous avez reçu ce produit : notez-le et aidez les autres clients.
        </p>
      </div>

      <div>
        <span className="etiquette">Votre note</span>
        <div className="flex items-center gap-1" onMouseLeave={() => setSurvol(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNote(n)}
              onMouseEnter={() => setSurvol(n)}
              className={`text-3xl leading-none transition ${
                (survol || note) >= n ? 'text-amber-500' : 'text-slate-300'
              } hover:scale-110`}
              aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
              aria-pressed={note === n}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm font-bold text-slate-700">{LIBELLES[survol || note]}</span>
        </div>
      </div>

      <div>
        <label className="etiquette" htmlFor="titre">Titre de l’avis (facultatif)</label>
        <input
          id="titre"
          className="champ"
          maxLength={80}
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex. Attiéké très frais, livraison rapide"
        />
      </div>

      <div>
        <label className="etiquette" htmlFor="commentaire">Votre commentaire</label>
        <textarea
          id="commentaire"
          required
          minLength={5}
          maxLength={1000}
          rows={4}
          className="champ"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Qualité, goût, emballage, délai de livraison…"
        />
        <p className="mt-1 text-right text-[11px] text-slate-400">{commentaire.length}/1000</p>
      </div>

      {erreur && <p role="alert" className="text-sm text-rose-700">{erreur}</p>}

      <button disabled={chargement} className="bouton-primaire w-full sm:w-auto">
        {chargement ? 'Envoi…' : 'Publier mon avis'}
      </button>
    </form>
  );
}
