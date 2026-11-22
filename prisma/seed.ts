/**
 * Script de peuplement : catalogue 100 % ivoirien.
 * Villes et quartiers d'Abidjan, noms ivoiriens, prix en FCFA, téléphones +225.
 * Lancement : npm run db:seed
 */
import { PrismaClient, Role, StatutCommande, ModePaiement } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { nom: 'Épicerie & Marché', slug: 'epicerie' },
  { nom: 'Plats ivoiriens', slug: 'plats-ivoiriens' },
  { nom: 'Mode & Pagnes', slug: 'mode-pagnes' },
  { nom: 'Artisanat', slug: 'artisanat' },
  { nom: 'Beauté & Karité', slug: 'beaute' },
  { nom: 'Maison', slug: 'maison' },
];

type ProduitSeed = {
  nom: string;
  slug: string;
  description: string;
  prix: number; // FCFA, entier
  ancienPrix?: number; // prix barré (promo)
  stock: number;
  categorie: string;
  image: string;
  origine: string;
  artisan: string;
  matiere: string;
};

const PRODUITS: ProduitSeed[] = [
  /* ------------------------- Plats ivoiriens ------------------------- */
  {
    nom: 'Attiéké frais de Dabou (1 kg)',
    slug: 'attieke-frais-dabou',
    description:
      "Attiéké frais préparé à Dabou à partir de manioc fermenté, texture fine et légèrement acidulée. Le compagnon du poisson braisé.\nPrêt à cuire 5 minutes à la vapeur · 1 kg · à consommer sous 3 jours.",
    prix: 2500,
    stock: 60,
    categorie: 'plats-ivoiriens',
    image: '/images/attieke-poisson.webp',
    origine: 'Dabou',
    artisan: 'Coopérative des femmes de Dabou',
    matiere: 'Manioc fermenté',
  },
  {
    nom: 'Attiéké poisson braisé (plat prêt)',
    slug: 'attieke-poisson-braise',
    description:
      "Le classique de Treichville : attiéké de Dabou, machoiron braisé au feu de bois, tomates, oignons et piment vert.\nLivré chaud à Abidjan entre 11 h et 14 h.",
    prix: 4500,
    stock: 25,
    categorie: 'plats-ivoiriens',
    image: '/images/attieke-plat.webp',
    origine: 'Abidjan — Treichville',
    artisan: 'Cuisine de Chez Nous, Treichville',
    matiere: 'Attiéké, machoiron, piment',
  },
  {
    nom: 'Alloco (banane plantain frite)',
    slug: 'alloco',
    description:
      "Bananes plantain bien mûres frites à l'huile, servies avec piment frais écrasé et oignons.\nLe goûter préféré des Abidjanais · barquette de 500 g.",
    prix: 1500,
    stock: 40,
    categorie: 'plats-ivoiriens',
    image: '/images/alloco.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Alloco de Yopougon',
    matiere: 'Banane plantain, huile de palme',
  },
  {
    nom: 'Kedjenou de poulet',
    slug: 'kedjenou-de-poulet',
    description:
      "Poulet fermier mijoté à l'étouffée dans une canari, tomates, oignons, ail, gingembre et piment.\nSans eau ajoutée : le kedjenou cuit dans son propre jus · 2 personnes.",
    prix: 6000,
    stock: 18,
    categorie: 'plats-ivoiriens',
    image: '/images/kedjenou.webp',
    origine: 'Abidjan — Cocody',
    artisan: 'Maman Adjoua, Angré 7e Tranche',
    matiere: 'Poulet fermier, tomate, gingembre',
  },
  {
    nom: 'Sauce graine (500 ml)',
    slug: 'sauce-graine',
    description:
      "Sauce graine préparée à base de noix de palme pilées, viande de bœuf et poisson fumé.\nÀ accompagner de foutou banane ou de placali.",
    prix: 3500,
    stock: 25,
    categorie: 'epicerie',
    image: '/images/sauce-graine.webp',
    origine: 'Abidjan',
    artisan: 'Cuisine de Chez Nous',
    matiere: 'Noix de palmiste, viande, poisson fumé',
  },
  {
    nom: 'Poudre de placali 500 g',
    slug: 'poudre-placali',
    description:
      'Farine de manioc fermenté pour préparer le placali, accompagnement traditionnel ivoirien à la texture souple.\n1 sachet = 4 portions.',
    prix: 1800,
    stock: 40,
    categorie: 'epicerie',
    image: '/images/placali.webp',
    origine: 'Dabou',
    artisan: 'Coopérative vivrière de Dabou',
    matiere: 'Manioc fermenté',
  },
  {
    nom: 'Gombo frais (500 g)',
    slug: 'gombo-frais',
    description:
      "Gombos frais du jour, cueillis dans la région de l'Agnéby-Tiassa. Parfaits pour une sauce gombo bien filante.\n500 g · calibre moyen.",
    prix: 800,
    stock: 50,
    categorie: 'epicerie',
    image: '/images/gombo.webp',
    origine: 'Agboville',
    artisan: 'Maraîchers de l’Agnéby',
    matiere: 'Gombo frais',
  },
  {
    nom: 'Aubergine africaine (500 g)',
    slug: 'aubergine-africaine',
    description:
      "Petites aubergines locales, légèrement amères, indispensables à la sauce claire et au kedjenou.\n500 g · récolte du jour.",
    prix: 700,
    stock: 45,
    categorie: 'epicerie',
    image: '/images/aubergine.webp',
    origine: 'Bingerville',
    artisan: 'Maraîchers de Bingerville',
    matiere: 'Aubergine africaine',
  },
  {
    nom: 'Poisson fumé au bois (500 g)',
    slug: 'poisson-fume-bois',
    description:
      "Machoiron et carpes fumés au bois dans les fumoirs de Grand-Lahou. Goût fumé puissant, chair ferme.\n500 g · sous vide.",
    prix: 5000,
    stock: 30,
    categorie: 'epicerie',
    image: '/images/poisson-fume.webp',
    origine: 'Grand-Lahou',
    artisan: 'Fumoirs de Grand-Lahou',
    matiere: 'Machoiron fumé',
  },
  {
    nom: 'Huile de palme rouge (1 L)',
    slug: 'huile-de-palme-rouge',
    description:
      "Huile de palme rouge non raffinée, pressée artisanalement dans le Sud ivoirien.\nRiche en vitamine A · 1 litre · bouteille en verre.",
    prix: 2500,
    stock: 35,
    categorie: 'epicerie',
    image: '/images/huile-palme.webp',
    origine: 'Aboisso',
    artisan: 'Presses artisanales de l’Indénié',
    matiere: 'Noix de palme',
  },
  {
    nom: 'Légumes du marché (panier 3 kg)',
    slug: 'legumes-du-marche',
    description:
      "Panier composé chaque matin au marché d'Adjamé : tomates, oignons, gombo, aubergines, piment et feuilles de manioc.\n3 kg environ, selon arrivage.",
    prix: 4000,
    stock: 20,
    categorie: 'epicerie',
    image: '/images/legumes.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Marché d’Adjamé',
    matiere: 'Légumes frais assortis',
  },
  {
    nom: 'Bissap séché 200 g',
    slug: 'bissap-seche',
    description:
      "Fleurs d'hibiscus séchées pour préparer le bissap, la boisson rouge nationale.\n200 g · environ 4 litres de jus.",
    prix: 1500,
    stock: 55,
    categorie: 'epicerie',
    image: '/images/bissap.webp',
    origine: 'Korhogo',
    artisan: 'Productrices du Poro',
    matiere: 'Hibiscus séché',
  },

  /* ------------------------- Mode & Pagnes ------------------------- */
  {
    nom: 'Pagne wax Uniwax 6 yards',
    slug: 'pagne-wax-uniwax',
    description:
      "Pagne wax 100 % coton imprimé à Abidjan, motifs « Bracelet de Sapé ». Idéal pour tailleurs et couturières.\n6 yards · 1,15 m de large.",
    prix: 18000,
    stock: 40,
    categorie: 'mode-pagnes',
    image: '/images/pagne-wax.webp',
    origine: 'Abidjan — Yopougon',
    artisan: 'Ateliers Uniwax',
    matiere: 'Coton wax',
  },
  {
    nom: 'Pagne wax bleu & or (6 yards)',
    slug: 'pagne-wax-bleu-or',
    description:
      'Wax aux motifs géométriques bleu et or, très demandé pour les cérémonies et les tenues de mariage.\n6 yards · coton 100 %.',
    prix: 16500,
    stock: 28,
    categorie: 'mode-pagnes',
    image: '/images/pagne-wax2.webp',
    origine: 'Abidjan — Treichville',
    artisan: 'Coupons du marché de Treichville',
    matiere: 'Coton wax',
  },
  {
    nom: 'Pagne wax jaune bordeaux',
    slug: 'pagne-wax-jaune-bordeaux',
    description:
      "Motif wax jaune bordeaux et orange, chaleur et éclat pour les grandes occasions.\n6 yards · coton imprimé.",
    prix: 17000,
    stock: 22,
    categorie: 'mode-pagnes',
    image: '/images/pagne-wax3.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Marché d’Adjamé',
    matiere: 'Coton wax',
  },
  {
    nom: 'Chemise en kita tissé',
    slug: 'chemise-kita',
    description:
      'Chemise homme taillée dans un kita baoulé tissé main à Tiébissou, couleurs or et vert.\nTailles M à XXL.',
    prix: 25000,
    stock: 12,
    categorie: 'mode-pagnes',
    image: '/images/chemise.webp',
    origine: 'Tiébissou',
    artisan: 'Tisserands baoulé',
    matiere: 'Coton kita',
  },
  {
    nom: 'Boubou brodé homme',
    slug: 'boubou-brode',
    description:
      'Grand boubou en bazin riche brodé, porté pour la Tabaski et les cérémonies.\nCouleur blanc cassé.',
    prix: 35000,
    stock: 8,
    categorie: 'mode-pagnes',
    image: '/images/boubou.webp',
    origine: 'Abidjan — Plateau',
    artisan: 'Atelier de couture du Plateau',
    matiere: 'Bazin brodé',
  },
  {
    nom: 'Sac en pagne wax',
    slug: 'sac-pagne-wax',
    description: 'Sac cabas doublé, cousu à partir de chutes de wax Uniwax. Anses renforcées.',
    prix: 9000,
    stock: 20,
    categorie: 'mode-pagnes',
    image: '/images/sac-wax.webp',
    origine: 'Abidjan — Koumassi',
    artisan: 'Atelier Koumassi Couture',
    matiere: 'Coton wax',
  },

  /* ------------------------- Artisanat ------------------------- */
  {
    nom: 'Masque Baoulé en bois',
    slug: 'masque-baoule',
    description:
      "Masque Baoulé sculpté à la main en bois d'ébène, patine naturelle. Pièce décorative unique.\nHauteur 35 cm.",
    prix: 45000,
    stock: 5,
    categorie: 'artisanat',
    image: '/images/masque-baoule.webp',
    origine: 'Bouaké',
    artisan: 'Sculpteurs baoulé de Bouaké',
    matiere: 'Bois d’ébène',
  },
  {
    nom: 'Toile de Korhogo peinte',
    slug: 'toile-korhogo',
    description:
      "Toile de coton tissée puis peinte à la main avec des pigments naturels par les peintres de Korhogo.\n70 × 100 cm · motif « village et animaux ».",
    prix: 22000,
    stock: 14,
    categorie: 'artisanat',
    image: '/images/toile-korhogo.webp',
    origine: 'Korhogo',
    artisan: 'Peintres de la région du Poro',
    matiere: 'Coton peint',
  },
  {
    nom: 'Djembé artisanal',
    slug: 'djembe-artisanal',
    description:
      'Djembé sculpté dans un tronc de bois, peau de chèvre tendue à la main, cordage traditionnel.\nHauteur 60 cm · son profond.',
    prix: 65000,
    stock: 4,
    categorie: 'artisanat',
    image: '/images/djembe.webp',
    origine: 'Man',
    artisan: 'Sculpteurs de Man',
    matiere: 'Bois, peau de chèvre',
  },
  {
    nom: 'Panier tressé de Grand-Bassam',
    slug: 'panier-grand-bassam',
    description:
      'Panier tressé en raphia et fibres naturelles, anses renforcées, parfait pour le marché.\nDimensions : 38 × 28 × 24 cm.',
    prix: 12000,
    stock: 16,
    categorie: 'artisanat',
    image: '/images/panier-raphia.webp',
    origine: 'Grand-Bassam',
    artisan: 'Tresseuses de Grand-Bassam',
    matiere: 'Raphia',
  },
  {
    nom: 'Tabouret Sénoufo',
    slug: 'tabouret-senoufo',
    description: 'Tabouret monoxyle sculpté dans un seul bloc de bois, motif Sénoufo.',
    prix: 38000,
    stock: 6,
    categorie: 'artisanat',
    image: '/images/tabouret.webp',
    origine: 'Korhogo',
    artisan: 'Sculpteurs sénoufo',
    matiere: 'Bois massif',
  },
  {
    nom: 'Bracelet perles Akan',
    slug: 'bracelet-perles-akan',
    description: 'Bracelet en perles de verre enfilées à la main, motifs akan or et vert.',
    prix: 4500,
    stock: 30,
    categorie: 'artisanat',
    image: '/images/bracelet.webp',
    origine: 'Abidjan — Treichville',
    artisan: 'Perlières de Treichville',
    matiere: 'Perles de verre',
  },

  /* ------------------------- Beauté & Karité ------------------------- */
  {
    nom: 'Beurre de karité brut (500 g)',
    slug: 'beurre-de-karite',
    description:
      "Beurre de karité non raffiné, baratté par une coopérative féminine du nord de la Côte d'Ivoire.\nNourrit la peau et les cheveux · 500 g · sans additif.",
    prix: 3500,
    stock: 45,
    categorie: 'beaute',
    image: '/images/karite.webp',
    origine: 'Korhogo',
    artisan: 'Coopérative féminine de Korhogo',
    matiere: 'Karité brut',
  },
  {
    nom: 'Savon noir à l’huile de palme',
    slug: 'savon-noir',
    description:
      "Savon noir traditionnel à base de cendres de cabosses de cacao et d'huile de palme. Nettoie en douceur.\nPain de 200 g.",
    prix: 1500,
    stock: 60,
    categorie: 'beaute',
    image: '/images/savon-noir.webp',
    origine: 'Abidjan — Yopougon',
    artisan: 'Savonnerie artisanale de Yopougon',
    matiere: 'Huile de palme, cendre de cacao',
  },
  {
    nom: 'Beurre de karité parfumé (250 g)',
    slug: 'beurre-de-karite-parfume',
    description: "Karité brut enrichi d'une pointe de vanille et de citron, en pot de verre rechargeable.",
    prix: 4000,
    stock: 25,
    categorie: 'beaute',
    image: '/images/karite2.webp',
    origine: 'Bouaké',
    artisan: 'Coopérative de Bouaké',
    matiere: 'Karité, vanille',
  },
  {
    nom: 'Huile de coco vierge 250 ml',
    slug: 'huile-coco-vierge',
    description: "Huile de coco pressée à froid, pour les cheveux, la peau et la cuisine.",
    prix: 3000,
    stock: 32,
    categorie: 'beaute',
    image: '/images/huile-coco.webp',
    origine: 'Grand-Lahou',
    artisan: 'Presses de Grand-Lahou',
    matiere: 'Noix de coco',
  },
  {
    nom: 'Beurre de cacao ivoirien 200 g',
    slug: 'beurre-de-cacao',
    description: 'Beurre de cacao pur, première transformation en Côte d’Ivoire, premier producteur mondial.',
    prix: 3200,
    stock: 28,
    categorie: 'beaute',
    image: '/images/cacao.webp',
    origine: 'San-Pédro',
    artisan: 'Transformateurs de San-Pédro',
    matiere: 'Beurre de cacao',
  },

  /* ------------------------- Maison ------------------------- */
  {
    nom: 'Poterie décorative de Katiola',
    slug: 'poterie-katiola',
    description: 'Vase tourné et cuit au feu de bois par les potières de Katiola.',
    prix: 14000,
    stock: 9,
    categorie: 'maison',
    image: '/images/poterie.webp',
    origine: 'Katiola',
    artisan: 'Poterie de Katiola',
    matiere: 'Terre cuite',
  },
  {
    nom: 'Set de sous-verres en raphia',
    slug: 'sous-verres-raphia',
    description: 'Six sous-verres tressés en raphia, rangés dans un petit panier.',
    prix: 6000,
    stock: 18,
    categorie: 'maison',
    image: '/images/sous-verres.webp',
    origine: 'Grand-Bassam',
    artisan: 'Tresseuses de Grand-Bassam',
    matiere: 'Raphia',
  },
  {
    nom: 'Calebasse décorée du Nord',
    slug: 'calebasse-decoree',
    description: 'Calebasse gravée à la main, motif géométrique sénoufo.',
    prix: 7500,
    stock: 12,
    categorie: 'maison',
    image: '/images/calebasse.webp',
    origine: 'Korhogo',
    artisan: 'Graveurs sénoufo',
    matiere: 'Calebasse',
  },
  {
    nom: 'Chocolat noir 70 % cacao ivoirien',
    slug: 'chocolat-noir-70',
    description: 'Tablette de 100 g, cacao ivoirien transformé localement, notes de fruits rouges.',
    prix: 2500,
    stock: 50,
    categorie: 'epicerie',
    image: '/images/chocolat.webp',
    origine: 'Abidjan — Zone industrielle',
    artisan: 'Chocolaterie ivoirienne',
    matiere: 'Cacao 70 %',
  },
  /* ------------------- Nouveautés : café, miel, cajou, épices ------------------- */
  {
    nom: 'Café Robusta de Man (1 kg)',
    slug: 'cafe-robusta-man',
    description:
      "Grains de robusta cultivés dans l'Ouest ivoirien et torréfiés artisanalement à Man. Notes de cacao et de noisette, corps puissant.\nIdéal pour le café noir du matin · 1 kg en grains.",
    prix: 6000,
    ancienPrix: 8000,
    stock: 35,
    categorie: 'epicerie',
    image: '/images/cafe-robusta.webp',
    origine: 'Man',
    artisan: 'Coopérative caféière de Man',
    matiere: 'Café robusta torréfié',
  },
  {
    nom: 'Café moulu ivoirien 250 g',
    slug: 'cafe-moulu-250',
    description:
      "Café moulu prêt à infuser, torréfaction moyenne pour garder l'arôme. Sachet refermable 250 g.\nParfait pour la cafetière à filtre ou l'italienne.",
    prix: 3500,
    stock: 40,
    categorie: 'epicerie',
    image: '/images/cafe-tasse.webp',
    origine: 'Man',
    artisan: 'Torréfaction de Man',
    matiere: 'Café moulu',
  },
  {
    nom: 'Café en grains sac 5 kg (revendeur)',
    slug: 'cafe-grains-sac-5kg',
    description:
      "Sac de 5 kg pour les maquis, boutiques et hôtels d'Abidjan. Robusta ivoirien fraîchement torréfié, conditionné sous film.\nTarif revendeur, facture sur demande.",
    prix: 27000,
    stock: 12,
    categorie: 'epicerie',
    image: '/images/cafe-sac.webp',
    origine: 'Man',
    artisan: 'Coopérative caféière de Man',
    matiere: 'Café robusta',
  },
  {
    nom: 'Miel de Toumodi (500 g)',
    slug: 'miel-toumodi',
    description:
      "Miel toutes fleurs récolté dans la savane de Toumodi, non chauffé, non filtré industriellement.\nPot en verre 500 g · texture crémeuse, goût boisé.",
    prix: 5000,
    ancienPrix: 6500,
    stock: 28,
    categorie: 'epicerie',
    image: '/images/miel.webp',
    origine: 'Toumodi',
    artisan: 'Apiculteurs de Toumodi',
    matiere: 'Miel toutes fleurs',
  },
  {
    nom: 'Miel des savanes du Nord (250 g)',
    slug: 'miel-savanes-nord',
    description:
      "Récolte de saison sèche, miel ambré et parfumé des savanes du Nord ivoirien. Pot 250 g.\nÀ déguster en tartine ou en infusion au gingembre.",
    prix: 4500,
    stock: 22,
    categorie: 'epicerie',
    image: '/images/miel2.webp',
    origine: 'Korhogo',
    artisan: 'Union des apiculteurs du Nord',
    matiere: 'Miel de savane',
  },
  {
    nom: 'Huile de coco vierge 500 ml',
    slug: 'huile-coco-500ml',
    description:
      "Huile de coco extraite à froid, pressée par une coopérative de Grand-Bassam.\nCheveux, peau et cuisine · flacon verre 500 ml.",
    prix: 4500,
    stock: 30,
    categorie: 'beaute',
    image: '/images/huile-coco2.webp',
    origine: 'Grand-Bassam',
    artisan: 'Coopérative coco de Grand-Bassam',
    matiere: 'Coco pressée à froid',
  },
  {
    nom: 'Kita baoulé au mètre',
    slug: 'kita-au-metre',
    description:
      "Bande de kita tissée à Tiébissou, vendue au mètre. Motifs géométriques traditionnels baoulé.\nTissu robuste pour boubou, veste ou décoration.",
    prix: 3500,
    stock: 60,
    categorie: 'mode-pagnes',
    image: '/images/kita.webp',
    origine: 'Tiébissou',
    artisan: 'Tisserands de Tiébissou',
    matiere: 'Coton tissé',
  },
  {
    nom: 'Noix de cajou grillées 500 g',
    slug: 'noix-cajou-grillees',
    description:
      "Noix de cajou de Bouaké, grillées lentement et légèrement salées. Sachet refermable 500 g.\nL'apéritif ivoirien par excellence, riche en protéines.",
    prix: 4000,
    ancienPrix: 5000,
    stock: 45,
    categorie: 'epicerie',
    image: '/images/cajou.webp',
    origine: 'Bouaké',
    artisan: 'Transformateurs de cajou de Bouaké',
    matiere: 'Anacarde grillé',
  },
  {
    nom: 'Noix de cajou nature 250 g',
    slug: 'noix-cajou-nature',
    description:
      "Cajou non salé, idéal pour la pâtisserie et le grignotage sain. 250 g.\nPremière transformation locale, sans conservateur.",
    prix: 2800,
    stock: 50,
    categorie: 'epicerie',
    image: '/images/cajou2.webp',
    origine: 'Bouaké',
    artisan: 'Transformateurs de cajou de Bouaké',
    matiere: 'Anacarde nature',
  },
  {
    nom: 'Piment fort frais (200 g)',
    slug: 'piment-fort-frais',
    description:
      "Piment ivoirien bien relevé, écrasé au mortier le matin même à Adjamé. Barquette 200 g.\nAttention : très fort. À conserver au frais.",
    prix: 1000,
    stock: 70,
    categorie: 'epicerie',
    image: '/images/piment.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Marché d’Adjamé',
    matiere: 'Piment frais',
  },
  {
    nom: 'Épices mêlées du Nord (100 g)',
    slug: 'epices-melees-nord',
    description:
      "Mélange maison : gingembre, poivre de Guinée, piment séché, ail et clou de girofle.\nParfait pour le kedjenou et les grillades · 100 g.",
    prix: 2500,
    stock: 38,
    categorie: 'epicerie',
    image: '/images/epices.webp',
    origine: 'Korhogo',
    artisan: 'Épicières de Korhogo',
    matiere: 'Épices séchées',
  },
  {
    nom: 'Purée de piment au gingembre (200 g)',
    slug: 'puree-piment-gingembre',
    description:
      "Purée artisanale de piment rouge et gingembre, sans conservateur. Pot 200 g.\nLa touche qui réveille l'attiéké et le poisson braisé.",
    prix: 2000,
    stock: 55,
    categorie: 'epicerie',
    image: '/images/piment2.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Cuisine de Chez Nous',
    matiere: 'Piment, gingembre',
  },
  {
    nom: 'Sandales en cuir de Korhogo',
    slug: 'sandales-cuir-korhogo',
    description:
      "Sandales homme en cuir tanné et cousu main à Korhogo. Semelle renforcée, coutures doubles.\nPointures 40 à 45 · patine naturelle.",
    prix: 12000,
    stock: 18,
    categorie: 'artisanat',
    image: '/images/sandales.webp',
    origine: 'Korhogo',
    artisan: 'Atelier de maroquinerie de Korhogo',
    matiere: 'Cuir tanné',
  },
  {
    nom: 'Sandales perles femme',
    slug: 'sandales-perles-femme',
    description:
      "Sandales fines ornées de perles colorées, montées à la main. Confortables pour les cérémonies.\nPointures 36 à 41.",
    prix: 9000,
    stock: 20,
    categorie: 'artisanat',
    image: '/images/sandales2.webp',
    origine: 'Korhogo',
    artisan: 'Atelier de maroquinerie de Korhogo',
    matiere: 'Cuir, perles',
  },
  {
    nom: 'Poisson braisé entier (machoiron)',
    slug: 'poisson-braise-entier',
    description:
      "Machoiron entier braisé au feu de bois, farci d'oignons, tomates et piment vert.\nLivré chaud à Abidjan entre 11 h et 14 h, avec attiéké en option.",
    prix: 7500,
    stock: 15,
    categorie: 'plats-ivoiriens',
    image: '/images/poisson-braise.webp',
    origine: 'Grand-Lahou',
    artisan: 'Cuisine de Chez Nous, Treichville',
    matiere: 'Machoiron braisé',
  },
  {
    nom: 'Attiéké famille 2 kg',
    slug: 'attieke-famille-2kg',
    description:
      "Le grand format pour les repas de famille du dimanche. Attiéké frais de Dabou, texture fine.\n2 kg · à cuire 5 minutes à la vapeur.",
    prix: 4500,
    stock: 45,
    categorie: 'plats-ivoiriens',
    image: '/images/attieke-hero.webp',
    origine: 'Dabou',
    artisan: 'Coopérative des femmes de Dabou',
    matiere: 'Manioc fermenté',
  },
  {
    nom: 'Attiéké sec 1 kg',
    slug: 'attieke-sec-1kg',
    description:
      "Attiéké séché, à conserver plusieurs mois. À réhydrater puis cuire à la vapeur.\nPratique pour la diaspora et les longues semaines · 1 kg.",
    prix: 3000,
    stock: 60,
    categorie: 'epicerie',
    image: '/images/attieke-table.webp',
    origine: 'Dabou',
    artisan: 'Coopérative des femmes de Dabou',
    matiere: 'Manioc séché',
  },
  {
    nom: 'Alloco grande barquette (1 kg)',
    slug: 'alloco-grande-barquette',
    description:
      "Un kilo d'alloco croustillant pour partager, avec piment frais et oignons.\nLe format des soirées et des matchs.",
    prix: 2500,
    stock: 35,
    categorie: 'plats-ivoiriens',
    image: '/images/alloco2.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Maquis de Yopougon',
    matiere: 'Banane plantain',
  },
  {
    nom: 'Poisson fumé au bois 1 kg',
    slug: 'poisson-fume-1kg',
    description:
      "Poisson fumé artisanalement à Grand-Lahou, séché sur claies de bois.\nParfum intense pour la sauce graine et le kedjenou · 1 kg.",
    prix: 9000,
    stock: 25,
    categorie: 'epicerie',
    image: '/images/poisson-fume2.webp',
    origine: 'Grand-Lahou',
    artisan: 'Fumeuses de Grand-Lahou',
    matiere: 'Poisson fumé',
  },
  {
    nom: 'Huile de palme rouge 5 L',
    slug: 'huile-palme-5l',
    description:
      "Bidon de 5 L d'huile de palme rouge non raffinée, pressée en Côte d'Ivoire.\nGoût authentique pour sauce graine, foutou et alloco.",
    prix: 12000,
    stock: 20,
    categorie: 'epicerie',
    image: '/images/huile-palme2.webp',
    origine: 'Agnéby-Tiassa',
    artisan: 'Pressoirs d’Agboville',
    matiere: 'Huile de palme brute',
  },
  {
    nom: 'Panier de légumes 5 kg',
    slug: 'panier-legumes-5kg',
    description:
      "Sélection du marché d'Anyama : gombo, aubergines, tomates, oignons, piment et feuilles.\n5 kg livrés frais, récoltés la veille.",
    prix: 7000,
    stock: 30,
    categorie: 'epicerie',
    image: '/images/legumes2.webp',
    origine: 'Anyama',
    artisan: 'Coopérative maraîchère d’Anyama',
    matiere: 'Légumes frais',
  },
  {
    nom: 'Boubou femme en bazin brodé',
    slug: 'boubou-femme-bazin',
    description:
      "Boubou femme en bazin riche, broderie main au col et aux manches. Coupe ample et élégante.\nTaille unique ajustable · plusieurs coloris sur demande.",
    prix: 28000,
    stock: 10,
    categorie: 'mode-pagnes',
    image: '/images/boubou2.webp',
    origine: 'Bouaké',
    artisan: 'Atelier de couture de Bouaké',
    matiere: 'Bazin riche brodé',
  },
  {
    nom: 'Pochette en pagne wax',
    slug: 'pochette-wax',
    description:
      "Pochette zippée en wax doublé, format soirée. Fabriquée à Abidjan par une artisane.\nBandoulière amovible.",
    prix: 6500,
    stock: 24,
    categorie: 'mode-pagnes',
    image: '/images/sac-wax2.webp',
    origine: 'Abidjan — Cocody',
    artisan: 'Atelier Nafi, Cocody',
    matiere: 'Wax, doublure coton',
  },
  {
    nom: 'Toile de Korhogo grand format',
    slug: 'toile-korhogo-grand',
    description:
      "Toile de Korhogo peinte à la main par un artiste sénoufo, grand format mural.\nPièce unique, motifs animaux et scènes de village.",
    prix: 22000,
    stock: 8,
    categorie: 'artisanat',
    image: '/images/toile-korhogo2.webp',
    origine: 'Korhogo',
    artisan: 'Peintres sénoufo de Korhogo',
    matiere: 'Coton peint',
  },
  {
    nom: 'Masque Baoulé grand modèle',
    slug: 'masque-baoule-grand',
    description:
      "Masque baoulé sculpté dans un bois massif, patine naturelle. Pièce de collection.\nHauteur environ 45 cm, livré avec support mural.",
    prix: 35000,
    stock: 6,
    categorie: 'artisanat',
    image: '/images/masque-baoule2.webp',
    origine: 'Bouaké',
    artisan: 'Sculpteurs baoulé de Bouaké',
    matiere: 'Bois sculpté',
  },
  {
    nom: 'Savon noir trio (3 pains)',
    slug: 'savon-noir-trio',
    description:
      "Trois pains de savon noir à l'huile de palme, fabrication traditionnelle de Katiola.\nNettoie en profondeur, idéal pour la peau grasse.",
    prix: 3500,
    stock: 40,
    categorie: 'beaute',
    image: '/images/savon-noir2.webp',
    origine: 'Katiola',
    artisan: 'Savonnières de Katiola',
    matiere: 'Huile de palme, cendre',
  },
  {
    nom: 'Banane plantain mûre (régime 5 kg)',
    slug: 'banane-plantain-frais',
    description:
      "Régime de plantain mûr à point, cueilli dans l'Agnéby-Tiassa. Idéal pour l'alloco, le foutou ou le braisé.\n5 kg · mûrissement naturel, sans traitement.",
    prix: 3000,
    stock: 40,
    categorie: 'epicerie',
    image: '/images/banane-plantain.webp',
    origine: 'Adzopé',
    artisan: 'Coopérative agricole d’Adzopé',
    matiere: 'Banane plantain',
  },
  {
    nom: 'Igname kponan de Bondoukou (5 kg)',
    slug: 'igname-bondoukou',
    description:
      "Igname kponan du Nord-Est, chair ferme et sucrée, très appréciée pour le foutou et l'igname pilée.\n5 kg · calibre moyen, épluchage facile.",
    prix: 6000,
    stock: 25,
    categorie: 'epicerie',
    image: '/images/igname.webp',
    origine: 'Bondoukou',
    artisan: 'Coopérative de Bondoukou',
    matiere: 'Igname kponan',
  },
  {
    nom: 'Manioc frais (5 kg)',
    slug: 'manioc-frais',
    description:
      "Tubercules de manioc frais du Sud-Comoé, pour l'attiéké maison, le placali ou le foutou.\n5 kg · récolte de la semaine.",
    prix: 2500,
    stock: 30,
    categorie: 'epicerie',
    image: '/images/manioc.webp',
    origine: 'Aboisso',
    artisan: 'Groupement des productrices d’Aboisso',
    matiere: 'Manioc frais',
  },
  {
    nom: 'Ananas pain de sucre (2 pièces)',
    slug: 'ananas-pain-sucre',
    description:
      "L'ananas pain de sucre de Bonoua, très parfumé et peu acide. Livré à maturité pour une dégustation immédiate.\n2 pièces d'environ 1,2 kg chacune.",
    prix: 2000,
    stock: 50,
    categorie: 'epicerie',
    image: '/images/ananas.webp',
    origine: 'Bonoua',
    artisan: 'Coopérative de Bonoua',
    matiere: 'Ananas pain de sucre',
  },
  {
    nom: 'Noix de coco fraîche (lot de 3)',
    slug: 'noix-coco-fraiche',
    description:
      "Trois noix de coco fraîches de la lagune, à l'eau sucrée et à la chair tendre.\nParfaites pour le jus de coco, le braisé de poisson ou le lait maison.",
    prix: 1500,
    stock: 60,
    categorie: 'epicerie',
    image: '/images/coco.webp',
    origine: 'Grand-Lahou',
    artisan: 'Producteurs de Grand-Lahou',
    matiere: 'Noix de coco',
  },
  {
    nom: 'Riz local de Gagnoa (5 kg)',
    slug: 'riz-local-gagnoa',
    description:
      "Riz blanchi produit dans la région du Gôh, grain long et peu cassant. Soutenez la riziculture ivoirienne.\nSac de 5 kg.",
    prix: 5500,
    ancienPrix: 6500,
    stock: 35,
    categorie: 'epicerie',
    image: '/images/riz-local.webp',
    origine: 'Gagnoa',
    artisan: 'Coopérative rizicole de Gagnoa',
    matiere: 'Riz local blanchi',
  },
  {
    nom: 'Alloco prêt à frire (2 kg)',
    slug: 'alloco-pret-frire',
    description:
      "Banane plantain mûre déjà épluchée et découpée sous vide : 8 minutes de friture et l'alloco est prêt.\n2 kg · à conserver au frais 48 h.",
    prix: 3500,
    stock: 28,
    categorie: 'plats-ivoiriens',
    image: '/images/alloco-hero.webp',
    origine: 'Abidjan — Yopougon',
    artisan: 'Maquis de Yopougon',
    matiere: 'Banane plantain',
  },
  {
    nom: 'Pagne kita royal (4 yards)',
    slug: 'pagne-kita-royal',
    description:
      "Tissé à la main sur métier traditionnel, motifs géométriques baoulé en coton mercerisé.\n4 yards · pièce unique, bords francs cousus.",
    prix: 42000,
    ancienPrix: 52000,
    stock: 8,
    categorie: 'mode-pagnes',
    image: '/images/kita2.webp',
    origine: 'Bouaké',
    artisan: 'Atelier de tisserands de Bouaké',
    matiere: 'Coton tissé',
  },
  {
    nom: 'Poulet fermier entier (1,5 kg)',
    slug: 'poulet-fermier-entier',
    description:
      "Poulet de chair élevé au sol à Yamoussoukro, vidé et prêt à cuisiner. Chair ferme, idéale pour le kedjenou ou le braisé.\nEnviron 1,5 kg · livré frais sous glace.",
    prix: 8500,
    ancienPrix: 10000,
    stock: 12,
    categorie: 'plats-ivoiriens',
    image: '/images/poulet-fermier.webp',
    origine: 'Yamoussoukro',
    artisan: 'Ferme avicole de la Marahoué',
    matiere: 'Volaille fermière',
  },
  {
    nom: 'Jus de bissap artisanal (1 L)',
    slug: 'jus-bissap-artisanal',
    description:
      "Bissap pressé à froid, infusé avec de la menthe fraîche et légèrement sucré. Sans conservateur, à boire frais.\nBouteille de 1 L · à consommer sous 5 jours.",
    prix: 2000,
    stock: 40,
    categorie: 'epicerie',
    image: '/images/bissap-jus.webp',
    origine: 'Abidjan — Cocody',
    artisan: 'Atelier Bissap d’Akwaba',
    matiere: 'Hibiscus, menthe',
  },
  {
    nom: 'Poisson séché tilapia (500 g)',
    slug: 'poisson-seche-tilapia',
    description:
      "Tilapia séché au soleil puis fumé légèrement, comme sur les marchés de Grand-Lahou. Parfume le riz, le foutou et la sauce claire.\n500 g · emballé sous vide.",
    prix: 4500,
    stock: 25,
    categorie: 'epicerie',
    image: '/images/poisson-seche.webp',
    origine: 'Grand-Lahou',
    artisan: 'Fumeuses de Grand-Lahou',
    matiere: 'Tilapia séché',
  },
  {
    nom: 'Panier marché du samedi (5 kg)',
    slug: 'panier-marche-samedi',
    description:
      "Le panier composé chaque samedi matin à Adjamé : gombo, aubergines, piment, tomates, oignons, feuilles de manioc.\n5 kg de légumes frais · composition selon la récolte.",
    prix: 12000,
    ancienPrix: 15000,
    stock: 18,
    categorie: 'epicerie',
    image: '/images/marche-adjame.webp',
    origine: 'Abidjan — Adjamé',
    artisan: 'Marché d’Adjamé',
    matiere: 'Légumes frais',
  },
  {
    nom: 'Coffret découverte Côte d’Ivoire',
    slug: 'coffret-decouverte-ci',
    description:
      "Le cadeau qui fait plaisir : attiéké sec, bissap, chocolat 70 %, café de Man, savon noir et beurre de karité dans un panier tressé.\n6 produits · notice de dégustation incluse.",
    prix: 25000,
    ancienPrix: 32000,
    stock: 10,
    categorie: 'artisanat',
    image: '/images/marche-treichville.webp',
    origine: 'Abidjan — Treichville',
    artisan: 'Atelier Kolatier',
    matiere: 'Coffret multi-produits',
  },
];

/* -------------------------------------------------------------------------- */
/*  Comptes de démonstration                                                  */
/* -------------------------------------------------------------------------- */

const UTILISATEURS = [
  {
    nom: 'Aya Kouassi',
    email: 'admin@kolatier.ci',
    motDePasse: 'Admin123!',
    role: Role.ADMIN,
    telephone: '+225 07 07 12 34 56',
    commune: 'Cocody',
    quartier: 'Riviera 3',
    ville: 'Abidjan',
  },
  {
    nom: 'Koffi Yao',
    email: 'client@kolatier.ci',
    motDePasse: 'Client123!',
    role: Role.CLIENT,
    telephone: '+225 07 48 21 90 33',
    commune: 'Yopougon',
    quartier: 'Niangon Sud',
    ville: 'Abidjan',
  },
  {
    nom: 'Aminata Traoré',
    email: 'aminata@kolatier.ci',
    motDePasse: 'Aminata123!',
    role: Role.CLIENT,
    telephone: '+225 05 66 14 27 08',
    commune: 'Adjamé',
    quartier: 'Liberté',
    ville: 'Abidjan',
  },
  {
    nom: 'Yao N’Guessan',
    email: 'yao@kolatier.ci',
    motDePasse: 'Yao12345!',
    role: Role.CLIENT,
    telephone: '+225 01 52 39 77 41',
    commune: 'Marcory',
    quartier: 'Zone 4',
    ville: 'Abidjan',
  },
  {
    nom: 'Mariam Koné',
    email: 'mariam@kolatier.ci',
    motDePasse: 'Mariam123!',
    role: Role.CLIENT,
    telephone: '+225 07 09 88 45 12',
    commune: 'Bouaké',
    quartier: 'Air France',
    ville: 'Bouaké',
  },
];

/** Avis clients de démonstration (note, titre, achat vérifié). */
const AVIS: { email: string; slug: string; note: number; titre: string; commentaire: string; jours: number }[] = [
  { email: 'client@kolatier.ci', slug: 'attieke-frais-dabou', note: 5, titre: 'Attiéké vraiment frais',
    commentaire: "Reçu le matin même à Cocody, encore tiède. La texture est fine et ça ne sent pas l'aigre comme sur certains marchés. J'ai commandé deux fois cette semaine.", jours: 4 },
  { email: 'aminata@kolatier.ci', slug: 'attieke-frais-dabou', note: 4, titre: 'Bon produit, emballage à revoir',
    commentaire: "Le goût est excellent et le sachet sous vide garde bien la fraîcheur. J’enlève une étoile car le sac extérieur était un peu mouillé à la livraison.", jours: 11 },
  { email: 'yao@kolatier.ci', slug: 'attieke-frais-dabou', note: 5, titre: 'Comme à Dabou',
    commentaire: 'Exactement le goût du village. Livraison à Yopougon en moins de 24 h, le livreur a appelé avant de passer.', jours: 20 },
  { email: 'mariam@kolatier.ci', slug: 'pagne-wax-uniwax', note: 5, titre: 'Vrai Uniwax, tissu épais',
    commentaire: "Le wax est lourd et les couleurs ne bavent pas au lavage. J'ai cousu un ensemble pour un mariage à Bouaké, tout le monde m'a demandé où je l'avais acheté.", jours: 6 },
  { email: 'aminata@kolatier.ci', slug: 'pagne-wax-uniwax', note: 4, titre: 'Belles couleurs',
    commentaire: 'Six yards bien complets, les motifs sont nets. Livraison un jour plus tard que prévu mais le colis était bien fermé.', jours: 15 },
  { email: 'client@kolatier.ci', slug: 'beurre-de-karite', note: 5, titre: 'Karité brut, pas raffiné',
    commentaire: "Odeur de karité naturelle, un peu forte au début, mais très efficace sur la peau sèche de bébé. Le pot est bien rempli, aucun débordement.", jours: 9 },
  { email: 'mariam@kolatier.ci', slug: 'beurre-de-karite', note: 5, titre: 'Je reprends tous les mois',
    commentaire: 'Troisième commande. Qualité constante et prix correct comparé aux boutiques de Cocody.', jours: 27 },
  { email: 'yao@kolatier.ci', slug: 'cafe-robusta-man', note: 4, titre: 'Bon café corsé',
    commentaire: "Torréfaction assez foncée, parfait pour le café du matin. Le paquet d'un kilo est bien scellé.", jours: 7 },
  { email: 'aminata@kolatier.ci', slug: 'kedjenou-de-poulet', note: 5, titre: 'Kedjenou goûtu',
    commentaire: "Poulet bien assaisonné, sauce généreuse. Réchauffé à la vapeur c'était encore meilleur. Portion suffisante pour deux personnes.", jours: 3 },
  { email: 'client@kolatier.ci', slug: 'alloco', note: 4, titre: 'Alloco croustillant',
    commentaire: 'Bien mûr, pas trop gras. Le piment fourni est vraiment fort, attention !', jours: 13 },
  { email: 'mariam@kolatier.ci', slug: 'huile-de-palme-rouge', note: 5, titre: "L'huile rouge de ma grand-mère",
    commentaire: 'Couleur bien rouge, pas coupée. J’ai fait la sauce graine et le goût était parfait.', jours: 17 },
  { email: 'yao@kolatier.ci', slug: 'miel-toumodi', note: 4, titre: 'Miel épais et parfumé',
    commentaire: 'Il cristallise un peu, ce qui est bon signe pour un miel non chauffé. Bouchon bien fermé.', jours: 22 },
  { email: 'aminata@kolatier.ci', slug: 'panier-grand-bassam', note: 5, titre: 'Panier solide et joli',
    commentaire: 'Tressage serré, aucun brin qui dépasse. Il sert maintenant de panier à fruits dans le salon.', jours: 30 },
  { email: 'client@kolatier.ci', slug: 'masque-baoule', note: 4, titre: 'Belle pièce artisanale',
    commentaire: 'Bois lourd, finition brute comme attendu. Légèrement plus petit que sur la photo mais très beau.', jours: 34 },
  { email: 'mariam@kolatier.ci', slug: 'savon-noir', note: 5, titre: 'Efficace contre les boutons',
    commentaire: "Utilisé depuis trois semaines, la peau de mon fils s'est beaucoup calmée. Odeur de palmiste, mousse peu.", jours: 8 },
  { email: 'yao@kolatier.ci', slug: 'poisson-fume-bois', note: 5, titre: 'Poisson fumé bien sec',
    commentaire: 'Bien fumé, pas humide, il se conserve au congélateur sans perdre le goût. Idéal pour le kedjenou.', jours: 5 },
  { email: 'mariam@kolatier.ci', slug: 'attieke-poisson-braise', note: 5, titre: 'Plat généreux',
    commentaire: 'Poisson braisé entier avec attiéké, piment à part. Livré chaud à Marcory, parfait pour le déjeuner.', jours: 2 },
  { email: 'yao@kolatier.ci', slug: 'boubou-brode', note: 4, titre: 'Boubou de cérémonie',
    commentaire: 'Broderie soignée, taille fidèle au guide. Je l’ai porté pour la fête de fin d’année.', jours: 19 },
];

async function main() {
  console.log('🌱 Peuplement du catalogue ivoirien…');

  await prisma.avis.deleteMany();
  await prisma.messageContact.deleteMany();
  await prisma.ligneCommande.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.produit.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.utilisateur.deleteMany();

  // --- Catégories ---
  const categories = new Map<string, number>();
  for (const c of CATEGORIES) {
    const creee = await prisma.categorie.create({ data: c });
    categories.set(c.slug, creee.id);
  }
  console.log(`  ✓ ${CATEGORIES.length} catégories`);

  // --- Produits ---
  for (const p of PRODUITS) {
    await prisma.produit.create({
      data: {
        nom: p.nom,
        slug: p.slug,
        description: p.description,
        prix: p.prix,
        ancienPrix: p.ancienPrix ?? null,
        stock: p.stock,
        image: p.image,
        origine: p.origine,
        artisan: p.artisan,
        matiere: p.matiere,
        categorieId: categories.get(p.categorie)!,
      },
    });
  }
  console.log(`  ✓ ${PRODUITS.length} produits ivoiriens`);

  // --- Utilisateurs ---
  const utilisateurs: { id: number; role: Role; nom: string; email: string }[] = [];
  for (const u of UTILISATEURS) {
    const cree = await prisma.utilisateur.create({
      data: {
        nom: u.nom,
        email: u.email,
        motDePasse: await bcrypt.hash(u.motDePasse, 10),
        role: u.role,
      },
    });
    utilisateurs.push({ id: cree.id, role: cree.role, nom: cree.nom, email: cree.email });
  }
  console.log(`  ✓ ${UTILISATEURS.length} comptes (1 admin, 4 clients)`);

  // --- Commandes de démonstration (Abidjan + Bouaké) ---
  const tous = await prisma.produit.findMany();
  const parSlug = (slug: string) => tous.find((p) => p.slug === slug)!;
  const clients = utilisateurs.filter((u) => u.role === Role.CLIENT);
  const client = clients[0].id;

  const jeu: {
    client: number;
    statut: StatutCommande;
    paiement: ModePaiement;
    lignes: { slug: string; quantite: number }[];
    adresse: string;
    commune: string;
    quartier: string;
    ville: string;
    tel: string;
    jours: number;
  }[] = [
    {
      client,
      statut: StatutCommande.LIVREE,
      paiement: ModePaiement.ORANGE_MONEY,
      lignes: [
        { slug: 'attieke-frais-dabou', quantite: 2 },
        { slug: 'poisson-fume-bois', quantite: 1 },
        { slug: 'huile-de-palme-rouge', quantite: 1 },
      ],
      adresse: 'Rue L92, immeuble les Palmiers',
      commune: 'Yopougon',
      quartier: 'Niangon Sud',
      ville: 'Abidjan',
      tel: '+225 07 48 21 90 33',
      jours: 9,
    },
    {
      client: utilisateurs[2].id,
      statut: StatutCommande.EXPEDIEE,
      paiement: ModePaiement.WAVE,
      lignes: [
        { slug: 'pagne-wax-uniwax', quantite: 1 },
        { slug: 'savon-noir', quantite: 3 },
      ],
      adresse: 'Avenue 21, derrière la mosquée',
      commune: 'Adjamé',
      quartier: 'Liberté',
      ville: 'Abidjan',
      tel: '+225 05 66 14 27 08',
      jours: 2,
    },
    {
      client: utilisateurs[3].id,
      statut: StatutCommande.EN_ATTENTE,
      paiement: ModePaiement.MTN_MOMO,
      lignes: [
        { slug: 'kedjenou-de-poulet', quantite: 1 },
        { slug: 'alloco', quantite: 2 },
        { slug: 'bissap-seche', quantite: 1 },
      ],
      adresse: 'Boulevard de Marseille, résidence Akwaba',
      commune: 'Marcory',
      quartier: 'Zone 4',
      ville: 'Abidjan',
      tel: '+225 01 52 39 77 41',
      jours: 1,
    },
    {
      client: utilisateurs[4].id,
      statut: StatutCommande.EN_ATTENTE,
      paiement: ModePaiement.MOOV_MONEY,
      lignes: [
        { slug: 'beurre-de-karite', quantite: 2 },
        { slug: 'masque-baoule', quantite: 1 },
      ],
      adresse: 'Quartier Air France, non loin du marché',
      commune: 'Bouaké',
      quartier: 'Air France',
      ville: 'Bouaké',
      tel: '+225 07 09 88 45 12',
      jours: 0,
    },
    {
      client,
      statut: StatutCommande.ANNULEE,
      paiement: ModePaiement.LIVRAISON,
      lignes: [{ slug: 'djembe-artisanal', quantite: 1 }],
      adresse: 'Rue L92, immeuble les Palmiers',
      commune: 'Yopougon',
      quartier: 'Niangon Sud',
      ville: 'Abidjan',
      tel: '+225 07 48 21 90 33',
      jours: 16,
    },
  ];

  let compteur = 1;
  for (const j of jeu) {
    const lignes = j.lignes.map((l) => {
      const produit = parSlug(l.slug);
      return {
        produitId: produit.id,
        quantite: l.quantite,
        prixUnitaire: produit.prix,
        nomProduit: produit.nom,
      };
    });

    const sousTotal = lignes.reduce((t, l) => t + Number(l.prixUnitaire) * l.quantite, 0);
    const fraisPort = sousTotal >= 50000 ? 0 : 2000;
    const date = new Date();
    date.setDate(date.getDate() - j.jours);

    await prisma.commande.create({
      data: {
        reference: `KOL-DEMO${String(compteur++).padStart(3, '0')}`,
        statut: j.statut,
        total: sousTotal + fraisPort,
        adresseLivraison: j.adresse,
        ville: j.ville,
        codePostal: `${j.commune} — ${j.quartier}`,
        telephone: j.tel,
        modePaiement: j.paiement,
        creeLe: date,
        utilisateurId: j.client,
        lignes: { create: lignes },
      },
    });
  }
  console.log(`  ✓ ${jeu.length} commandes de démonstration`);

  // --- Avis clients (démonstration) ---
  const parEmail = new Map(utilisateurs.map((u) => [u.email, u.id]));
  const parSlugAvis = new Map(
    (await prisma.produit.findMany({ select: { id: true, slug: true } })).map((p) => [p.slug, p.id]),
  );
  let nbAvis = 0;
  for (const a of AVIS) {
    const utilisateurId = parEmail.get(a.email);
    const produitId = parSlugAvis.get(a.slug);
    if (!utilisateurId || !produitId) continue;
    await prisma.avis.create({
      data: {
        note: a.note,
        titre: a.titre,
        commentaire: a.commentaire,
        achatVerifie: true,
        creeLe: new Date(Date.now() - a.jours * 86400000),
        utilisateurId,
        produitId,
      },
    });
    nbAvis += 1;
  }
  console.log(`  ✓ ${nbAvis} avis clients`);


  console.log('\n✅ Terminé.');
  console.log('   Admin  : admin@kolatier.ci / Admin123!');
  console.log('   Client : client@kolatier.ci / Client123!');
  console.log('   Client : aminata@kolatier.ci / Aminata123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
