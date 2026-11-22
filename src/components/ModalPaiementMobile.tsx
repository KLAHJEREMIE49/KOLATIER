'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatPrix } from '@/lib/utils';
import { normaliserTelephone, OPERATEURS, type CodeOperateur } from '@/lib/ivoire';

type Props = {
  operateur: CodeOperateur | null;
  montant: number;
  onFermer: () => void;
  onConfirmer: (details: { telephone: string; nom: string; reference: string }) => void;
  nomInitial?: string;
  telephoneInitial?: string;
};

type Etape = 'formulaire' | 'traitement' | 'succes';

/** Compte à rebours du QR Wave (5 minutes, comme l'app réelle). */
function useMinuteur(actif: boolean) {
  const [restant, setRestant] = useState(300);
  useEffect(() => {
    if (!actif) return;
    const id = setInterval(() => setRestant((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [actif]);
  const mm = String(Math.floor(restant / 60)).padStart(2, '0');
  const ss = String(restant % 60).padStart(2, '0');
  return { texte: `${mm}:${ss}`, expire: restant === 0 };
}

/**
 * Modal de paiement Mobile Money.
 * Wave affiche un QR **réellement généré côté serveur** (route /api/paiement/qr),
 * scannable par n'importe quel lecteur — mais en mode démonstration.
 */
export function ModalPaiementMobile({
  operateur,
  montant,
  onFermer,
  onConfirmer,
  nomInitial = '',
  telephoneInitial = '',
}: Props) {
  const [nom, setNom] = useState(nomInitial);
  const [telephone, setTelephone] = useState(telephoneInitial);
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [etape, setEtape] = useState<Etape>('formulaire');
  const [reference, setReference] = useState('');
  const [refQr] = useState(() => `KOL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  const estWave = operateur === 'WAVE';
  const minuteur = useMinuteur(estWave);

  if (!operateur) return null;
  const codeOperateur: CodeOperateur = operateur;
  const op = OPERATEURS[codeOperateur];

  async function validerPaiement() {
    setEtape('traitement');
    const ref = `PAY-${codeOperateur.slice(0, 2)}-${Date.now().toString(36).toUpperCase()}`;
    await new Promise((resolve) => setTimeout(resolve, 1700));
    setReference(ref);
    setEtape('succes');
    const numero = normaliserTelephone(telephone) ?? telephone.trim();
    onConfirmer({ telephone: numero, nom: nom.trim() || 'Client Kolatier', reference: ref });
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');

    const numero = normaliserTelephone(telephone);
    if (!numero) {
      setErreur('Numéro ivoirien invalide : 10 chiffres commençant par 01, 05 ou 07.');
      return;
    }
    if (nom.trim().length < 3) {
      setErreur('Indiquez le nom enregistré sur le compte Mobile Money.');
      return;
    }
    if (codeOperateur !== 'WAVE' && code.trim().length < 4) {
      setErreur('Saisissez le code de confirmation reçu par SMS (4 chiffres).');
      return;
    }
    await validerPaiement();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-terre/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onFermer}
        role="dialog"
        aria-modal="true"
        aria-label={`Paiement ${op.nom}`}
      >
        <motion.div
          className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-premium sm:rounded-3xl"
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`sticky top-0 z-10 flex items-center justify-between gap-3 ${op.fond} px-5 py-4 ${op.texte}`}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/25 text-sm font-extrabold ring-1 ring-white/50">
                {op.logo}
              </span>
              <div>
                <p className="text-sm font-extrabold leading-tight">Payer avec {op.nom}</p>
                <p className="text-[11px] opacity-90">Montant : {formatPrix(montant)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onFermer}
              className="rounded-full bg-black/15 px-2.5 py-1 text-xs font-bold hover:bg-black/25"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {etape === 'formulaire' && (
            <form onSubmit={soumettre} className="space-y-4 p-5">
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200">
                Mode démonstration — aucun compte Mobile Money n’est débité.
              </p>

              <div>
                <label className="etiquette" htmlFor="pay-tel">Numéro {op.court}</label>
                <input
                  id="pay-tel"
                  className="champ"
                  inputMode="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+225 07 12 34 56 78"
                  autoComplete="tel"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">Numéro ivoirien à 10 chiffres (01, 05 ou 07).</p>
              </div>

              <div>
                <label className="etiquette" htmlFor="pay-nom">Nom sur le compte</label>
                <input
                  id="pay-nom"
                  className="champ"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex. Koffi Yao"
                  autoComplete="name"
                  required
                />
              </div>

              {estWave ? (
                <div className="rounded-2xl border border-wave/50 bg-wave/5 p-4 text-center">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0a7fa8]">
                    Scannez pour payer
                  </p>

                  {minuteur.expire ? (
                    <div className="mx-auto mt-3 grid h-[200px] w-[200px] place-items-center rounded-xl bg-white text-center text-xs font-bold text-rose-600 ring-1 ring-rose-200">
                      QR expiré
                      <span className="mt-1 block text-[10px] font-normal text-slate-500">
                        Relancez le paiement
                      </span>
                    </div>
                  ) : (
                    /* QR réel généré par /api/paiement/qr (PNG, scannable) */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/paiement/qr?montant=${montant}&ref=${refQr}`}
                      alt={`QR code de paiement Wave — référence ${refQr}, montant ${formatPrix(montant)}`}
                      width={200}
                      height={200}
                      className="mx-auto mt-3 h-[200px] w-[200px] rounded-xl bg-white p-1 ring-1 ring-wave/30"
                    />
                  )}

                  <p className="mt-2 font-mono text-[11px] font-bold text-slate-700">{refQr}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Valable <span className="font-mono font-bold text-terre">{minuteur.texte}</span> ·{' '}
                    {formatPrix(montant)}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    QR de démonstration — non relié à Wave
                  </p>
                </div>
              ) : (
                <div>
                  <label className="etiquette" htmlFor="pay-code">Code de confirmation</label>
                  <input
                    id="pay-code"
                    className="champ tracking-[0.4em]"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Code à 4 chiffres reçu par SMS (démonstration : saisissez 1234).
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-marque-50 px-3 py-2.5 text-sm ring-1 ring-marque-100">
                <span className="text-slate-600">Total à payer</span>
                <span className="font-extrabold text-terre">{formatPrix(montant)}</span>
              </div>

              {erreur && (
                <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
                  {erreur}
                </p>
              )}

              <button type="submit" className={`bouton w-full ${op.fond} ${op.texte} hover:opacity-90`}>
                {estWave ? "J'ai payé" : 'Confirmer le paiement'}
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Démonstration pédagogique · aucun débit réel
              </p>
            </form>
          )}

          {etape === 'traitement' && (
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <span className="relative grid h-16 w-16 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-marque-200/70" />
                <span className="relative h-10 w-10 animate-spin rounded-full border-4 border-marque-200 border-t-marque-600" />
              </span>
              <p className="text-sm font-bold text-terre">Vérification auprès de {op.nom}…</p>
              <p className="text-xs text-slate-500">Ne fermez pas cette fenêtre.</p>
            </div>
          )}

          {etape === 'succes' && (
            <div className="px-6 py-8 text-center">
              <motion.span
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-foret-100 text-3xl text-foret-700 ring-4 ring-foret-50"
              >
                ✓
              </motion.span>
              <p className="mt-4 text-lg font-extrabold text-terre">Paiement confirmé</p>
              <p className="mt-1 text-sm text-slate-600">{formatPrix(montant)} réglés via {op.nom}.</p>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500 ring-1 ring-slate-100">
                Référence : <span className="font-mono font-bold">{reference}</span> · {telephone}
              </p>
              <button type="button" onClick={onFermer} className="bouton-primaire mt-5 w-full">
                Continuer la commande
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
