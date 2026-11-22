'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePanier } from '@/store/cart';
import { formatPrix, fraisLivraison } from '@/lib/utils';
import { COMMUNES, COMMUNES_ABIDJAN, OPERATEURS, VILLES_CI, type CodeOperateur } from '@/lib/ivoire';
import { ModalPaiementMobile } from '@/components/ModalPaiementMobile';

type ModePaiement = 'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'WAVE' | 'LIVRAISON';

const MOYENS: { code: ModePaiement; nom: string; sous: string; couleur: string; texte: string }[] = [
  { code: 'ORANGE_MONEY', nom: 'Orange Money', sous: '#144#', couleur: '#ff7900', texte: '#fff' },
  { code: 'MTN_MOMO', nom: 'MTN MoMo', sous: '*133#', couleur: '#ffcc00', texte: '#3b2a1e' },
  { code: 'WAVE', nom: 'Wave', sous: 'Application', couleur: '#1dc8ff', texte: '#fff' },
  { code: 'MOOV_MONEY', nom: 'Moov Money', sous: '*155#', couleur: '#0a5cb8', texte: '#fff' },
  { code: 'LIVRAISON', nom: 'Paiement à la livraison', sous: 'En espèces au livreur', couleur: '#009e60', texte: '#fff' },
];

/** Page de finalisation de commande : adresse ivoirienne + paiement Mobile Money. */
export default function CommandePage() {
  const router = useRouter();
  const { articles, vider } = usePanier();
  const [form, setForm] = useState({
    adresseLivraison: '',
    commune: 'Cocody',
    quartier: 'Riviera 3',
    ville: 'Abidjan',
    telephone: '+225 ',
    modePaiement: 'ORANGE_MONEY' as ModePaiement,
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [paiementConfirme, setPaiementConfirme] = useState<{ reference: string; nom: string } | null>(null);

  const sousTotal = articles.reduce((t, a) => t + a.prix * a.quantite, 0);
  const fraisPort = fraisLivraison(sousTotal);
  const total = sousTotal + fraisPort;

  const quartiers = COMMUNES_ABIDJAN[form.commune] ?? [];

  function maj<K extends keyof typeof form>(champ: K, valeur: (typeof form)[K]) {
    setForm((f) => {
      const suivant = { ...f, [champ]: valeur };
      if (champ === 'commune' && form.ville === 'Abidjan') {
        suivant.quartier = COMMUNES_ABIDJAN[valeur as string]?.[0] ?? '';
      }
      if (champ === 'ville' && valeur !== 'Abidjan' && form.commune !== '') {
        suivant.commune = '';
        suivant.quartier = '';
      }
      return suivant;
    });
    if (champ === 'modePaiement') setPaiementConfirme(null);
  }

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');

    if (articles.length === 0) {
      setErreur('Votre panier est vide.');
      return;
    }
    if (form.modePaiement !== 'LIVRAISON' && !paiementConfirme) {
      setErreur('Validez d’abord le paiement Mobile Money avant de confirmer la commande.');
      return;
    }

    setChargement(true);
    const res = await fetch('/api/commande', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adresseLivraison: form.adresseLivraison,
        // La Côte d'Ivoire n'utilise pas de code postal : la colonne stocke commune — quartier
        codePostal: [form.commune, form.quartier].filter(Boolean).join(' — ') || form.ville,
        ville: form.ville,
        telephone: form.telephone,
        modePaiement: form.modePaiement,
        articles: articles.map((a) => ({ produitId: a.produitId, quantite: a.quantite })),
      }),
    });
    const data = await res.json();
    setChargement(false);

    if (!res.ok) {
      setErreur(data.erreur ?? 'Commande impossible.');
      return;
    }

    vider();
    router.push(`/commandes/${data.id}?nouvelle=1`);
    router.refresh();
  }

  return (
    <div className="conteneur py-8 sm:py-10">
      <h1 className="titre text-3xl font-extrabold">Finaliser ma commande</h1>
      <p className="mt-1 text-sm text-slate-600">Livraison partout en Côte d’Ivoire, paiement Mobile Money.</p>

      <form onSubmit={valider} className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* ------------------------- Livraison ------------------------- */}
        <div className="space-y-5 lg:col-span-2">
          <section className="carte p-5">
            <h2 className="flex items-center gap-2 font-bold text-terre">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-marque-500 text-xs font-extrabold text-white">1</span>
              Adresse de livraison
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="etiquette" htmlFor="adresse">Adresse précise</label>
                <input
                  id="adresse"
                  required
                  className="champ"
                  value={form.adresseLivraison}
                  onChange={(e) => maj('adresseLivraison', e.target.value)}
                  placeholder="Rue L92, immeuble les Palmiers, 2e étage"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="etiquette" htmlFor="ville">Ville</label>
                  <select
                    id="ville"
                    className="champ"
                    value={form.ville}
                    onChange={(e) => maj('ville', e.target.value)}
                  >
                    {VILLES_CI.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="etiquette" htmlFor="commune">Commune</label>
                  <select
                    id="commune"
                    className="champ"
                    value={form.commune}
                    onChange={(e) => maj('commune', e.target.value)}
                    disabled={form.ville !== 'Abidjan'}
                  >
                    {form.ville === 'Abidjan' ? (
                      COMMUNES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    ) : (
                      <option value="">—</option>
                    )}
                  </select>
                  {form.ville !== 'Abidjan' && (
                    <p className="mt-1 text-[11px] text-slate-500">Communes disponibles à Abidjan.</p>
                  )}
                </div>
              </div>

              {form.ville === 'Abidjan' && (
                <div>
                  <label className="etiquette" htmlFor="quartier">Quartier</label>
                  <select
                    id="quartier"
                    className="champ"
                    value={form.quartier}
                    onChange={(e) => maj('quartier', e.target.value)}
                  >
                    {quartiers.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="etiquette" htmlFor="tel">Téléphone (WhatsApp de préférence)</label>
                <input
                  id="tel"
                  required
                  className="champ"
                  inputMode="tel"
                  value={form.telephone}
                  onChange={(e) => maj('telephone', e.target.value)}
                  placeholder="+225 07 12 34 56 78"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Le livreur vous appelle sur ce numéro. Format : +225 01/05/07 XX XX XX XX.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------- Paiement ------------------------- */}
          <section className="carte p-5">
            <h2 className="flex items-center gap-2 font-bold text-terre">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-marque-500 text-xs font-extrabold text-white">2</span>
              Moyen de paiement
            </h2>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {MOYENS.map((m) => {
                const actif = form.modePaiement === m.code;
                return (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => maj('modePaiement', m.code)}
                    className={`flex items-center gap-3 rounded-2xl p-3 text-left ring-1 transition ${
                      actif ? 'ring-2 ring-marque-500 bg-marque-50' : 'ring-marque-100 bg-white hover:bg-slate-50'
                    }`}
                    aria-pressed={actif}
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold"
                      style={{ backgroundColor: m.couleur, color: m.texte }}
                    >
                      {m.code === 'LIVRAISON' ? '💵' : OPERATEURS[m.code as CodeOperateur].logo}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-terre">{m.nom}</span>
                      <span className="block truncate text-[11px] text-slate-500">{m.sous}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {form.modePaiement !== 'LIVRAISON' ? (
              <div className="mt-4 rounded-2xl border border-marque-200 bg-marque-50 p-4">
                {paiementConfirme ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-foret-700">✓ Paiement simulé confirmé</p>
                      <p className="mt-0.5 text-[11px] text-slate-600">
                        Référence {paiementConfirme.reference} · {paiementConfirme.nom}
                      </p>
                    </div>
                    <button type="button" className="bouton-secondaire !py-1.5 text-xs" onClick={() => setModalOuvert(true)}>
                      Modifier
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-terre">Payer {formatPrix(total)}</p>
                      <p className="mt-0.5 text-[11px] text-slate-600">
                        Formulaire {OPERATEURS[form.modePaiement as CodeOperateur].nom} · démonstration, aucun débit réel.
                      </p>
                    </div>
                    <button type="button" className="bouton-primaire !py-2" onClick={() => setModalOuvert(true)}>
                      Payer maintenant
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-foret-100 bg-foret-50 p-4">
                <p className="text-sm font-bold text-foret-800">Paiement à la livraison</p>
                <p className="mt-1 text-xs text-foret-700">
                  Vous réglerez {formatPrix(total)} en espèces au livreur, à Abidjan comme à l’intérieur du pays.
                </p>
              </div>
            )}
          </section>

          {erreur && (
            <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{erreur}</p>
          )}
        </div>

        {/* ------------------------- Récapitulatif ------------------------- */}
        <aside className="carte h-fit p-5 lg:sticky lg:top-28">
          <h2 className="font-bold text-terre">Votre commande</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {articles.map((a) => (
              <li key={a.produitId} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-slate-600">
                  {a.nom} × {a.quantite}
                </span>
                <span className="shrink-0 font-medium">{formatPrix(a.prix * a.quantite)}</span>
              </li>
            ))}
            {articles.length === 0 && <li className="text-slate-500">Panier vide.</li>}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Sous-total</dt>
              <dd>{formatPrix(sousTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Livraison</dt>
              <dd>{fraisPort === 0 ? 'Offerte 🎁' : formatPrix(fraisPort)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold">
              <dt>Total</dt>
              <dd className="text-marque-700">{formatPrix(total)}</dd>
            </div>
          </dl>

          <button type="submit" disabled={chargement} className="bouton-primaire mt-5 w-full">
            {chargement ? 'Validation…' : 'Confirmer la commande'}
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            Les prix et le stock sont revérifiés côté serveur dans une transaction. Aucun paiement réel
            n’est effectué : projet pédagogique.
          </p>
        </aside>
      </form>

      <ModalPaiementMobile
        operateur={modalOuvert ? (form.modePaiement as CodeOperateur) : null}
        montant={total}
        onFermer={() => setModalOuvert(false)}
        onConfirmer={(details) => {
          setPaiementConfirme({ reference: details.reference, nom: `${details.nom} · ${details.telephone}` });
          setModalOuvert(false);
        }}
      />
    </div>
  );
}
