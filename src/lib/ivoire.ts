/** Données géographiques et culturelles ivoiriennes (réutilisées par le checkout, le seed et les pages). */

/** Communes d'Abidjan avec leurs quartiers principaux. */
export const COMMUNES_ABIDJAN: Record<string, string[]> = {
  Abobo: ['Abobo Baoulé', 'Anonkoua-Kouté', 'Avocatier', 'Sagbé', 'PK18'],
  Adjamé: ['Bracodi', 'Liberté', 'Williamsville', 'Sicogi Adjamé', '220 Logements'],
  Attécoubé: ['Attécoubé Centre', 'Locodjro', 'Agban', 'Santé'],
  Cocody: ['Riviera 1', 'Riviera 2', 'Riviera 3', 'Riviera Palmeraie', 'Angré 7e Tranche', 'Deux-Plateaux Vallon', 'Blockhaus', 'Cocody Centre'],
  Koumassi: ['Sicogi', 'Remblais', 'Grand Marché', 'Zone industrielle', 'Divo'],
  Marcory: ['Zone 4', 'Anoumabo', 'Biétry', 'Marcory Résidentiel', 'Sans-Fil'],
  Plateau: ['Cité Administrative', 'Plateau Dokui', 'Quartier des Affaires'],
  'Port-Bouët': ['Vridi', 'Gonzagueville', 'Adjouffou', 'Aéroport'],
  Treichville: ['Avenue 12', 'Belleville', 'Zone portuaire', 'Arras'],
  Yopougon: ['Niangon Sud', 'Niangon Nord', 'Sicogi', 'Toit Rouge', 'Selmer', 'Abobodoumé', 'Kouté'],
  Bingerville: ['Bingerville Centre', 'Adjamé-Bingerville', 'Gbagba'],
  Songon: ['Songon-Dagbé', 'Songon-Agbanou', 'Songon-Kassemblé'],
  Anyama: ['Anyama Centre', 'Ahouabo', 'Long Way'],
};

export const COMMUNES = Object.keys(COMMUNES_ABIDJAN);

/** Villes ivoiriennes proposées à la livraison (hors Abidjan). */
export const VILLES_CI = [
  'Abidjan',
  'Bouaké',
  'Yamoussoukro',
  'San-Pédro',
  'Korhogo',
  'Daloa',
  'Man',
  'Gagnoa',
  'Abengourou',
  'Grand-Bassam',
  'Divo',
  'Bondoukou',
  'Séguéla',
  'Odienné',
];

/** Préfixes mobiles ivoiriens valides (01, 05, 07) — 10 chiffres au total. */
export const PREFIXES_TEL = ['01', '05', '07'];

/** Normalise un numéro ivoirien : renvoie "+225 07 12 34 56 78" ou null si invalide. */
export function normaliserTelephone(brut: string): string | null {
  const chiffres = (saisie: string) => saisie.replace(/[^0-9]/g, '').replace(/^225/, '');
  const chiffresSeuls = chiffres(saisieOuVide(brut));
  if (!/^(01|05|07)\d{8}$/.test(chiffresSeuls)) return null;
  const paires = chiffresSeuls.match(/.{2}/g) ?? [];
  return `+225 ${paires.join(' ')}`;
}

function saisieOuVide(valeur: string | undefined | null): string {
  return valeur ?? '';
}

/** Faux noms ivoiriens pour le seed (prénoms + patronymes courants). */
export const NOMS_IVOIRIENS = [
  'Aya Kouassi',
  'Koffi Yao',
  'Aminata Traoré',
  'Yao N’Guessan',
  'Mariam Koné',
  'Aboubakar Diomandé',
  'Adjoua Bamba',
  'Serge Aka',
  'Fatoumata Cissé',
  'Kouadio Assi',
];

/** Moyens de paiement Mobile Money, avec leur identité visuelle. */
export const OPERATEURS = {
  ORANGE_MONEY: {
    nom: 'Orange Money',
    court: 'Orange',
    code: '#144#',
    couleur: '#ff7900',
    texte: 'text-white',
    fond: 'bg-[#ff7900]',
    anneau: 'ring-[#ff7900]',
    aide: 'Composez #144# puis choisissez « Paiement marchand ».',
    logo: 'OM',
  },
  MTN_MOMO: {
    nom: 'MTN MoMo',
    court: 'MTN',
    code: '*133#',
    couleur: '#ffcc00',
    texte: 'text-terre',
    fond: 'bg-[#ffcc00]',
    anneau: 'ring-[#ffcc00]',
    aide: 'Composez *133# puis validez avec votre code secret MoMo.',
    logo: 'MTN',
  },
  WAVE: {
    nom: 'Wave',
    court: 'Wave',
    code: 'Application Wave',
    couleur: '#1dc8ff',
    texte: 'text-white',
    fond: 'bg-[#1dc8ff]',
    anneau: 'ring-[#1dc8ff]',
    aide: 'Ouvrez l’application Wave et scannez le QR affiché par le marchand.',
    logo: 'W',
  },
  MOOV_MONEY: {
    nom: 'Moov Money',
    court: 'Moov',
    code: '*155#',
    couleur: '#0a5cb8',
    texte: 'text-white',
    fond: 'bg-[#0a5cb8]',
    anneau: 'ring-[#0a5cb8]',
    aide: 'Composez *155# puis sélectionnez « Payer un marchand ».',
    logo: 'MM',
  },
} as const;

export type CodeOperateur = keyof typeof OPERATEURS;
