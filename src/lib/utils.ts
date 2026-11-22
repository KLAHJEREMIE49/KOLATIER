/** Formatage monétaire en francs CFA (XOF, Côte d'Ivoire). */
export function formatPrix(valeur: number | string | { toString(): string }): string {
  // Accepte les Decimal Prisma (qui exposent toString) autant que les number
  const n = typeof valeur === 'number' ? valeur : Number(valeur.toString());
  // Formatage manuel : Intl varie entre Node et les navigateurs (espaces, symbole), ce qui casse l'hydratation.
  const arrondi = Math.round(Number.isFinite(n) ? n : 0);
  const signe = arrondi < 0 ? '-' : '';
  const milliers = String(Math.abs(arrondi)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return `${signe}${milliers}\u00a0FCFA`;
}

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** Règle métier livraison : offerte dès 50 000 FCFA, sinon 2 000 FCFA. */
export const SEUIL_LIVRAISON_OFFERTE = 50000;
export const FRAIS_LIVRAISON = 2000;
export const MODES_PAIEMENT = {
  ORANGE_MONEY: 'Orange Money',
  MTN_MOMO: 'MTN MoMo',
  MOOV_MONEY: 'Moov Money',
  WAVE: 'Wave',
  LIVRAISON: 'Paiement à la livraison',
} as const;
export type ModePaiement = keyof typeof MODES_PAIEMENT;
export function fraisLivraison(sousTotal: number): number {
  return sousTotal === 0 || sousTotal >= SEUIL_LIVRAISON_OFFERTE ? 0 : FRAIS_LIVRAISON;
}

export function formatDate(date: Date | string): string {
  // Heure d'Abidjan = UTC : même résultat sur le serveur et dans tout navigateur.
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Slugifie un libellé : "Chaussures de sport" -> "chaussures-de-sport". */
export function slugify(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const STATUTS = {
  EN_ATTENTE: { label: 'En attente', classe: 'bg-amber-100 text-amber-800 ring-amber-200' },
  EXPEDIEE: { label: 'Expédiée', classe: 'bg-sky-100 text-sky-800 ring-sky-200' },
  LIVREE: { label: 'Livrée', classe: 'bg-emerald-100 text-emerald-800 ring-emerald-200' },
  ANNULEE: { label: 'Annulée', classe: 'bg-rose-100 text-rose-800 ring-rose-200' },
} as const;

export type Statut = keyof typeof STATUTS;

export function referenceCommande(): string {
  return `KOL-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
}
