/**
 * Catalogue des médias servis LOCALEMENT (aucune requête réseau).
 * Photos réelles de produits ivoiriens dans public/images,
 * clips courts H.264 dans public/videos.
 */

export const HERO_SLIDES = [
  {
    image: '/images/attieke-poisson.webp',
    surtitre: 'Le plat du jour',
    titre: 'Attiéké poisson braisé, comme à Treichville',
    texte: 'Attiéké de Dabou, machoiron braisé au feu de bois, piment frais. Le trio que tout Abidjan connaît.',
    cta: { href: '/produits/attieke-poisson-braise', label: 'Commander maintenant' },
    prix: '4 500 FCFA',
    accent: 'from-[#5c2100]/90 via-[#8a4206]/55 to-transparent',
  },
  {
    image: '/images/pagne-wax.webp',
    surtitre: 'Atelier couture',
    titre: 'Pagnes wax Uniwax : 6 yards, qualité authentique',
    texte: 'Wax Uniwax, kita baoulé, boubous brodés. Le vrai tissu ivoirien, livré chez vous.',
    cta: { href: '/produits?categorie=mode-pagnes', label: 'Voir les pagnes' },
    prix: '18 000 FCFA',
    accent: 'from-[#0b3d2c]/90 via-[#00663f]/55 to-transparent',
  },
  {
    image: '/images/marche-adjame.webp',
    surtitre: 'Akwaba sur Kolatier',
    titre: 'Tout le marché d’Adjamé, sans quitter la maison',
    texte: 'Légumes frais, poisson fumé, huile rouge : vos courses livrées en 24 h à Abidjan.',
    cta: { href: '/produits?categorie=epicerie', label: 'Faire le marché' },
    prix: '1 500 FCFA',
    accent: 'from-[#3b2a1e]/90 via-[#3b2a1e]/55 to-transparent',
  },
  {
    image: '/images/karite.webp',
    surtitre: 'Beauté naturelle',
    titre: 'Karité brut, savon noir, huile de coco',
    texte: 'Cosmétiques 100 % naturels, préparés par des coopératives féminines du Nord.',
    cta: { href: '/produits?categorie=beaute', label: 'Découvrir les soins' },
    prix: '4 900 FCFA',
    accent: 'from-[#4a3517]/90 via-[#8a4206]/50 to-transparent',
  },
  {
    image: '/images/alloco.webp',
    surtitre: 'À grignoter',
    titre: 'Alloco croustillant + piment frais',
    texte: 'Banane plantain bien mûre, frite à l’huile. Le goûter préféré des Abidjanais.',
    cta: { href: '/produits/alloco', label: 'En vouloir une barquette' },
    prix: '1 500 FCFA',
    accent: 'from-[#7a3d00]/90 via-[#f77f00]/50 to-transparent',
  },
];

export const PROMOS = [
  {
    titre: 'Attiéké poisson braisé',
    texte: 'Le classique de Treichville : attiéké de Dabou + machoiron braisé.',
    image: '/images/attieke-plat.webp',
    prix: 4500,
    ancienPrix: 6000,
    href: '/produits/attieke-poisson-braise',
  },
  {
    titre: 'Duo pagne wax + kita',
    texte: 'Deux tissus pour un seul tailleur : wax Uniwax et kita baoulé.',
    image: '/images/pagne-wax3.webp',
    prix: 20000,
    ancienPrix: 24500,
    href: '/produits?categorie=mode-pagnes',
  },
  {
    titre: 'Rituel karité & savon noir',
    texte: 'Beurre de karité brut 500 g + savon noir à l’huile de palme.',
    image: '/images/karite.webp',
    prix: 4900,
    ancienPrix: 6500,
    href: '/produits?categorie=beaute',
  },
  {
    titre: 'Panier découverte épicerie',
    texte: 'Attiéké sec, gombo, piment, huile de palme : de quoi cuisiner 4 plats.',
    image: '/images/legumes.webp',
    prix: 9500,
    ancienPrix: 12500,
    href: '/produits?categorie=epicerie',
  },
  {
    titre: 'Café Robusta de Man',
    texte: 'Grains torréfiés artisanalement dans l’Ouest, 1 kg.',
    image: '/images/cafe-robusta.webp',
    prix: 6000,
    ancienPrix: 8000,
    href: '/produits/cafe-robusta-man',
  },
];

export const VIDEOS = {
  ambiance: '/videos/ambiance-marche-ivoirien.mp4',
  attieke: '/videos/attieke-saveurs.mp4',
  pagne: '/videos/pagne-tissus.mp4',
};

export const POSTERS = {
  ambiance: '/images/poster-ambiance-marche-ivoirien.webp',
  attieke: '/images/poster-attieke-saveurs.webp',
  pagne: '/images/poster-pagne-tissus.webp',
};

/** Bandeau d'annonces défilant (haut de page). */
export const ANNONCES = [
  '🚚 Livraison à Abidjan en 24 h — Cocody, Yopougon, Marcory, Plateau',
  '🎁 Livraison offerte dès 50 000 FCFA',
  '💳 Orange Money · MTN MoMo · Wave · Moov Money',
  '🇨🇮 100 % produits ivoiriens, direct producteurs',
  '⚡ Offres du jour : jusqu’à -25 %',
];
