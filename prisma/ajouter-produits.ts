import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const produits = [
  {
    nom: 'Noix de cajou grillées 250 g',
    slug: 'noix-cajou-grillees',
    description: "Noix de cajou cultivées dans le nord de la Côte d'Ivoire, légèrement grillées et conditionnées en sachet.",
    prix: 3500,
    stock: 55,
    image: '/produits/cajou-grillees.svg',
    origine: 'Korhogo',
    artisan: 'Producteurs du Poro',
    matiere: 'Noix de cajou',
    categorie: 'epicerie',
  },
  {
    nom: 'Miel de forêt de Toumodi 250 g',
    slug: 'miel-foret-toumodi',
    description: 'Miel récolté et mis en pot par des apiculteurs locaux de la région du Bélier.',
    prix: 4000,
    stock: 24,
    image: '/produits/miel-toumodi.svg',
    origine: 'Toumodi',
    artisan: 'Apiculteurs du Bélier',
    matiere: 'Miel de fleurs',
    categorie: 'epicerie',
  },
  {
    nom: 'Poudre de placali 500 g',
    slug: 'poudre-placali',
    description: 'Farine de manioc fermenté pour préparer le placali, accompagnement traditionnel ivoirien.',
    prix: 1800,
    stock: 40,
    image: '/produits/poudre-placali.svg',
    origine: 'Dabou',
    artisan: 'Coopérative vivrière de Dabou',
    matiere: 'Manioc fermenté',
    categorie: 'epicerie',
  },
  {
    nom: 'Pâte de piment frais 200 g',
    slug: 'pate-piment-frais',
    description: 'Piment frais pilé et préparé en petite quantité pour relever les sauces et grillades.',
    prix: 1500,
    stock: 30,
    image: '/produits/pate-piment.svg',
    origine: 'Abidjan',
    artisan: 'Productrices du marché de Treichville',
    matiere: 'Piment frais',
    categorie: 'epicerie',
  },
  {
    nom: "Poudre d'akpi 100 g",
    slug: 'poudre-akpi',
    description: "Akpi sélectionné et moulu, utilisé dans plusieurs sauces et recettes de Côte d'Ivoire.",
    prix: 2500,
    stock: 26,
    image: '/produits/poudre-akpi.svg',
    origine: 'Gagnoa',
    artisan: 'Collectrices du Gôh',
    matiere: 'Graines d’akpi',
    categorie: 'epicerie',
  },
  {
    nom: 'Tissu kita baoulé au mètre',
    slug: 'tissu-kita-baoule',
    description: 'Bande de tissu kita tissée à la main avec des motifs géométriques traditionnels.',
    prix: 22000,
    stock: 10,
    image: '/produits/tissu-kita-baoule.svg',
    origine: 'Tiébissou',
    artisan: 'Tisserands baoulé',
    matiere: 'Coton tissé',
    categorie: 'mode-pagnes',
  },
  {
    nom: 'Poupée traditionnelle de Tano-Sakassou',
    slug: 'poupee-tano-sakassou',
    description: 'Petite poupée décorative inspirée des poupées de fécondité baoulé, réalisée par des artisans locaux.',
    prix: 12000,
    stock: 8,
    image: '/produits/poupee-baoule.svg',
    origine: 'Tano-Sakassou',
    artisan: 'Artisans baoulé',
    matiere: 'Bois sculpté et perles',
    categorie: 'artisanat',
  },
  {
    nom: 'Calebasse décorée du Nord',
    slug: 'calebasse-decoree',
    description: 'Calebasse séchée et décorée de motifs gravés, pour la décoration ou le service.',
    prix: 9000,
    stock: 12,
    image: '/produits/calebasse-decoree.svg',
    origine: 'Korhogo',
    artisan: 'Artisans graveurs du Poro',
    matiere: 'Calebasse naturelle',
    categorie: 'maison',
  },
  {
    nom: 'Éventail tressé de Grand-Bassam',
    slug: 'eventail-tresse',
    description: 'Éventail léger tressé à la main avec des fibres végétales locales.',
    prix: 5000,
    stock: 18,
    image: '/produits/eventail-tresse.svg',
    origine: 'Grand-Bassam',
    artisan: 'Vanniers de la lagune',
    matiere: 'Raphia et fibres végétales',
    categorie: 'accessoires',
  },
  {
    nom: 'Huile rouge de palmiste 500 ml',
    slug: 'huile-rouge-palmiste',
    description: 'Huile rouge extraite de noix de palme, utilisée dans les recettes et sauces ivoiriennes.',
    prix: 3000,
    stock: 35,
    image: '/produits/huile-palmiste.svg',
    origine: 'Aboisso',
    artisan: 'Productrices du Sud-Comoé',
    matiere: 'Noix de palme',
    categorie: 'epicerie',
  },
  {
    nom: 'Chips de banane plantain 150 g',
    slug: 'chips-banane-plantain',
    description: "Tranches fines de banane plantain proposées comme collation. Le producteur et l’origine du lot ne sont pas documentés dans ce catalogue de démonstration.",
    prix: 1800,
    stock: 45,
    image: '/produits/photos/chips-plantain.jpg',
    matiere: 'Banane plantain',
    categorie: 'epicerie',
  },
  {
    nom: 'Café Robusta en grains 250 g',
    slug: 'cafe-robusta-grains',
    description: "Grains de café torréfiés à moudre avant préparation. La photo illustre le type de produit ; l’origine et le torréfacteur du lot restent à confirmer.",
    prix: 2800,
    stock: 30,
    image: '/produits/photos/cafe-grains.jpg',
    matiere: 'Café Robusta',
    categorie: 'epicerie',
  },
  {
    nom: 'Mangue séchée 100 g',
    slug: 'mangue-sechee',
    description: "Tranches de mangue séchée à emporter ou à partager. L’origine et le producteur de ce lot de démonstration ne sont pas renseignés.",
    prix: 2200,
    stock: 32,
    image: '/produits/photos/mangue-sechee.jpg',
    matiere: 'Mangue',
    categorie: 'epicerie',
  },
  {
    nom: 'Kuli-kuli d’arachide 150 g',
    slug: 'kuli-kuli-arachide',
    description: "Collation croustillante à base d’arachide, de type kuli-kuli. La fabrication ivoirienne et la provenance de ce lot restent à confirmer.",
    prix: 1500,
    stock: 38,
    image: '/produits/photos/kuli-kuli.jpg',
    matiere: 'Arachide',
    categorie: 'epicerie',
  },
  {
    nom: 'Fèves de cacao brutes 250 g',
    slug: 'feves-cacao-brutes',
    description: "Fèves de cacao destinées aux préparations maison. La photo illustre le cacao, sans certifier l’origine du lot proposé.",
    prix: 3500,
    stock: 24,
    image: '/produits/photos/cabosse-cacao-illustration.jpg',
    matiere: 'Cacao',
    categorie: 'epicerie',
  },
  {
    nom: 'Infusion au gingembre 20 sachets',
    slug: 'infusion-gingembre',
    description: "Infusion au gingembre à préparer avec de l’eau chaude. Le fabricant et l’origine des ingrédients ne sont pas renseignés.",
    prix: 2500,
    stock: 28,
    image: '/produits/photos/infusion-gingembre-illustration.jpg',
    matiere: 'Gingembre',
    categorie: 'epicerie',
  },
  {
    nom: 'Farine de manioc et de maïs 500 g',
    slug: 'farine-manioc-mais',
    description: "Mélange de farines de manioc et de maïs pour les préparations du quotidien. Le producteur et l’origine du lot sont à renseigner.",
    prix: 2000,
    stock: 35,
    image: '/produits/photos/farine-manioc-mais.jpg',
    matiere: 'Manioc et maïs',
    categorie: 'epicerie',
  },
  {
    nom: 'Tapis décoratif tissé 80 × 120 cm',
    slug: 'tapis-decoratif-tisse',
    description: "Tapis décoratif à motifs géométriques. La photo est une illustration de tissage et ne certifie ni l’atelier ni le pays de fabrication.",
    prix: 28000,
    stock: 7,
    image: '/produits/photos/textile-tisse-illustration.jpg',
    matiere: 'Fibres textiles',
    categorie: 'maison',
  },
  {
    nom: 'Trio de pots décoratifs en terre cuite',
    slug: 'trio-pots-terre-cuite',
    description: "Ensemble décoratif de trois pièces en terre cuite. L’atelier et le lieu de fabrication ne sont pas documentés pour cette référence de démonstration.",
    prix: 18000,
    stock: 8,
    image: '/produits/photos/poterie-illustration.jpg',
    matiere: 'Terre cuite',
    categorie: 'maison',
  },
  {
    nom: 'Corbeilles murales tressées, lot de 2',
    slug: 'corbeilles-murales-tressees',
    description: "Deux corbeilles décoratives à suspendre. La photo présente des objets tressés à titre illustratif ; leur provenance n’est pas vérifiée.",
    prix: 12500,
    stock: 11,
    image: '/produits/photos/corbeilles-tressees.jpg',
    matiere: 'Fibres tressées',
    categorie: 'maison',
  },
];

async function main() {
  const categories = await prisma.categorie.findMany({
    where: { slug: { in: [...new Set(produits.map((produit) => produit.categorie))] } },
    select: { id: true, slug: true },
  });
  const categorieParSlug = new Map(categories.map((categorie) => [categorie.slug, categorie.id]));
  const categoriesManquantes = [...new Set(produits.map((produit) => produit.categorie))]
    .filter((slug) => !categorieParSlug.has(slug));

  if (categoriesManquantes.length > 0) {
    throw new Error(`Catégories absentes : ${categoriesManquantes.join(', ')}. Lancez d’abord le seed initial.`);
  }

  const donnees = produits.map(({ categorie, ...produit }) => {
    const categorieId = categorieParSlug.get(categorie);
    if (!categorieId) throw new Error(`Catégorie introuvable : ${categorie}`);
    return { ...produit, categorieId };
  });
  const resultat = await prisma.produit.createMany({ data: donnees, skipDuplicates: true });

  console.log(`✓ ${resultat.count} nouvelles références ajoutées ; ${produits.length - resultat.count} déjà présentes.`);
}

main()
  .catch((erreur: unknown) => {
    console.error('Échec de l’ajout des produits :', erreur);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
