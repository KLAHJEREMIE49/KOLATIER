import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { ProduitAffiche } from '@/components/ProduitCarte';
import { ProduitCarte } from '@/components/ProduitCarte';
import { CarrouselHero } from '@/components/CarrouselHero';
import { GrilleCategories, type CategorieIcone } from '@/components/GrilleCategories';
import { BandeauFlash } from '@/components/BandeauFlash';
import { CarrouselProduits } from '@/components/CarrouselProduits';
import { SectionVideo } from '@/components/SectionVideo';
import { Reveal } from '@/components/Reveal';
import { OPERATEURS } from '@/lib/ivoire';

export const dynamic = 'force-dynamic';

const relationsCarte = {
  categorie: { select: { nom: true } },
  avis: { select: { note: true } },
};

export default async function AccueilPage() {
  const [categories, nouveautes, ventes, totalProduits, promos, stocksSerres] = await Promise.all([
    prisma.categorie.findMany({
      where: { produits: { some: { actif: true } } },
      include: { _count: { select: { produits: { where: { actif: true } } } } },
      orderBy: { nom: 'asc' },
    }),
    prisma.produit.findMany({ where: { actif: true }, orderBy: { creeLe: 'desc' }, take: 12, include: relationsCarte }),
    prisma.ligneCommande.groupBy({
      by: ['produitId'],
      where: { commande: { statut: { not: 'ANNULEE' } }, produit: { actif: true } },
      _sum: { quantite: true },
      orderBy: { _sum: { quantite: 'desc' } },
      take: 12,
    }),
    prisma.produit.count({ where: { actif: true } }),
    prisma.produit.findMany({
      where: { actif: true, ancienPrix: { not: null }, stock: { gt: 0 } },
      orderBy: { prix: 'asc' },
      take: 8,
      include: relationsCarte,
    }),
    prisma.produit.findMany({
      where: { actif: true, stock: { gt: 0, lte: 14 } },
      orderBy: [{ stock: 'asc' }],
      take: 10,
      include: relationsCarte,
    }),
  ]);

  // Meilleures ventes réelles (agrégat des lignes de commande)
  const produitsVendus = ventes.length
    ? await prisma.produit.findMany({
        where: { id: { in: ventes.map((v) => v.produitId) }, actif: true },
        include: relationsCarte,
      })
    : [];
  const parId = new Map(produitsVendus.map((p) => [p.id, p]));
  const meilleuresVentes = ventes
    .map((v) => parId.get(v.produitId))
    .filter((p): p is (typeof produitsVendus)[number] => p !== undefined);
  const vedettes = meilleuresVentes.length >= 4 ? meilleuresVentes : [...promos, ...nouveautes].slice(0, 10);

  const categoriesIcones: CategorieIcone[] = categories.map((c) => ({
    id: c.id,
    nom: c.nom,
    slug: c.slug,
    nbProduits: c._count.produits,
  }));

  const promosFlash = promos.slice(0, 4).map((p) => ({
    id: p.id,
    nom: p.nom,
    slug: p.slug,
    prix: p.prix,
    ancienPrix: p.ancienPrix,
    image: p.image,
    stock: p.stock,
  }));

  return (
    <>
      <CarrouselHero />

      {/* Univers en cartes-icônes */}
      <GrilleCategories categories={categoriesIcones} />

      {/* Offres flash avec compte à rebours */}
      <BandeauFlash produits={promosFlash} />

      <CarrouselProduits
        produits={vedettes as ProduitAffiche[]}
        titre="Produits vedettes"
        badge="★ Meilleures ventes"
        sousTitre="Ce que les Abidjanais commandent le plus en ce moment."
        lien={{ href: '/produits?tri=populaire', label: 'Tout le catalogue' }}
        delai={2900}
      />

      <SectionVideo />

      <CarrouselProduits
        produits={promos as ProduitAffiche[]}
        titre="Promotions du moment"
        badge="🔥 Prix cassés"
        sousTitre="Ancien prix barré, stock limité : les affaires du jour."
        lien={{ href: '/produits?tri=promo', label: 'Voir les promos' }}
        delai={2700}
      />

      <CarrouselProduits
        produits={nouveautes as ProduitAffiche[]}
        titre="Nouveautés du marché"
        badge="Arrivages de la semaine"
        sousTitre="Les derniers produits sélectionnés à Abidjan."
        lien={{ href: '/produits?tri=recent', label: 'Voir les nouveautés' }}
        delai={3100}
      />

      {/* Stocks serrés : urgence */}
      <section className="conteneur py-8">
        <Reveal className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-rose-50 to-marque-50 p-4 ring-1 ring-rose-200">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">⚡ Ne ratez pas</p>
            <h2 className="titre text-xl font-extrabold text-terre sm:text-2xl">Les stocks les plus serrés</h2>
            <p className="mt-0.5 text-sm text-slate-600">Quantités limitées, servies dans l’ordre des commandes.</p>
          </div>
          <Link href="/produits?tri=populaire" className="bouton-secondaire !py-2 text-xs">
            Voir les bonnes affaires →
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stocksSerres.slice(0, 5).map((p) => (
            <Reveal key={p.id} y={18}>
              <ProduitCarte produit={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Paiement Mobile Money */}
      <section className="conteneur pb-10">
        <Reveal className="rounded-3xl bg-gradient-to-br from-terre via-[#4a3627] to-foret-900 p-6 text-ivoire shadow-premium sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-white/25">
                Paiement mobile
              </span>
              <h2 className="titre mt-3 text-2xl font-extrabold sm:text-3xl">
                Payez avec Orange Money, MTN, Wave ou Moov
              </h2>
              <p className="mt-3 text-sm text-ivoire/75">
                Choisissez votre opérateur au moment de commander : un formulaire dédié s’ouvre, vous
                saisissez votre numéro +225, puis vous recevez une référence de transaction.
              </p>
              <Link href="/produits" className="bouton-primaire mt-5">
                Commencer mes achats
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(OPERATEURS).map(([code, op]) => (
                <div key={code} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl text-xs font-extrabold"
                    style={{ backgroundColor: op.couleur, color: code === 'MTN_MOMO' ? '#3b2a1e' : '#fff' }}
                  >
                    {op.logo}
                  </span>
                  <p className="mt-3 text-sm font-bold">{op.nom}</p>
                  <p className="mt-0.5 text-[11px] text-ivoire/60">{op.code}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Grille complète */}
      <section className="conteneur pb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-foret-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-foret-700">
              Tout le catalogue
            </span>
            <h2 className="titre mt-1 text-2xl font-extrabold sm:text-3xl">Le meilleur de la Côte d’Ivoire</h2>
          </div>
          <Link href="/produits" className="text-sm font-bold text-marque-700 hover:underline">
            Voir les {totalProduits} produits →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[...promos, ...nouveautes, ...vedettes]
            .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
            .slice(0, 20)
            .map((p) => (
              <Reveal key={p.id} y={16}>
                <ProduitCarte produit={p} />
              </Reveal>
            ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/produits" className="bouton-secondaire">
            Explorer les {totalProduits} produits ivoiriens →
          </Link>
        </div>
      </section>

      {/* Chiffres */}
      <section className="border-y border-marque-100 bg-white/70">
        <div className="conteneur grid grid-cols-2 gap-6 py-9 text-center sm:grid-cols-4">
          {[
            { valeur: `${totalProduits}`, label: 'produits ivoiriens' },
            { valeur: `${categories.length}`, label: 'univers' },
            { valeur: '24 h', label: 'livraison Abidjan' },
            { valeur: '4', label: 'moyens Mobile Money' },
          ].map((s) => (
            <div key={s.label}>
              <p className="titre text-3xl font-extrabold text-marque-700">{s.valeur}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="conteneur py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-3xl bg-white p-6 shadow-carte ring-1 ring-marque-100">
            <h2 className="titre text-xl font-extrabold text-terre">Livré dans toutes les communes</h2>
            <p className="mt-2 text-sm text-slate-600">
              Cocody, Yopougon, Abobo, Adjamé, Koumassi, Marcory, Treichville, Plateau, Port-Bouët,
              Attécoubé, Bingerville… et l’intérieur du pays en 48–72 h.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Cocody', 'Yopougon', 'Marcory', 'Adjamé', 'Plateau', 'Koumassi', 'Treichville', 'Abobo'].map((c) => (
                <span key={c} className="rounded-full bg-marque-50 px-3 py-1 text-xs font-semibold text-marque-800">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08} className="rounded-3xl bg-white p-6 shadow-carte ring-1 ring-marque-100">
            <h2 className="titre text-xl font-extrabold text-terre">Directement des régions</h2>
            <p className="mt-2 text-sm text-slate-600">
              Attiéké de Dabou, karité de Korhogo, cajou de Bouaké, café de Man : nous achetons chez
              des coopératives et ateliers identifiés.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Dabou', 'Korhogo', 'Bouaké', 'Man', 'Grand-Bassam', 'Katiola', 'Grand-Lahou', 'Tiébissou'].map((o) => (
                <Link
                  key={o}
                  href={`/produits?origine=${encodeURIComponent(o)}`}
                  className="rounded-full bg-foret-50 px-3 py-1 text-xs font-semibold text-foret-700 hover:bg-foret-100"
                >
                  {o}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="conteneur pb-12">
        <div className="rounded-3xl bg-marque-50 p-7 text-center ring-1 ring-marque-100">
          <h2 className="titre text-2xl font-extrabold text-terre">Akwaba ! Créez votre compte en 30 secondes</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Suivez vos commandes, enregistrez votre adresse à Abidjan, gardez vos favoris et retrouvez
            votre panier sur tous vos appareils.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/inscription" className="bouton-primaire">Créer mon compte</Link>
            <Link href="/produits" className="bouton-secondaire">Explorer le catalogue</Link>
          </div>
        </div>
      </section>
    </>
  );
}
