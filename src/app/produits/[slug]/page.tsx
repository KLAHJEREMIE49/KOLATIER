import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrix } from '@/lib/utils';
import { BoutonAjout } from '@/components/AjouterPanier';
import { ProduitCarte } from '@/components/ProduitCarte';
import { FormulaireAvis } from '@/components/FormulaireAvis';
import { Etoiles } from '@/components/Etoiles';
import { ResumeAvis } from '@/components/ResumeAvis';
import { getCurrentUser } from '@/lib/auth';
import { VisuelProduit } from '@/components/VisuelProduit';
import { VideoProduit } from '@/components/SectionVideo';
import { POSTERS, VIDEOS } from '@/lib/media';

export const dynamic = 'force-dynamic';

/** Vidéo locale associée à certaines fiches (attiéké, pagnes). */
const VIDEOS_PRODUIT: Record<string, { src: string; poster: string; titre: string }> = {
  'attieke-frais-dabou': { src: VIDEOS.attieke, poster: POSTERS.attieke, titre: 'L’attiéké, geste par geste' },
  'attieke-poisson-braise': { src: VIDEOS.attieke, poster: POSTERS.attieke, titre: 'Attiéké poisson braisé' },
  'pagne-wax-uniwax': { src: VIDEOS.pagne, poster: POSTERS.pagne, titre: 'Le wax, du tissu au pagne' },
  'pagne-wax-bleu-or': { src: VIDEOS.pagne, poster: POSTERS.pagne, titre: 'Le wax, du tissu au pagne' },
  'pagne-wax-jaune-bordeaux': { src: VIDEOS.pagne, poster: POSTERS.pagne, titre: 'Le wax, du tissu au pagne' },
};

export default async function ProduitPage({ params }: { params: { slug: string } }) {
  const produit = await prisma.produit.findUnique({
    where: { slug: params.slug },
    include: { categorie: true, avis: { include: { utilisateur: { select: { nom: true } } }, orderBy: { creeLe: 'desc' } } },
  });

  if (!produit || !produit.actif) notFound();

  const pistesSimilaires: Prisma.ProduitWhereInput[] = [
    { categorieId: produit.categorieId },
    ...(produit.origine ? [{ origine: { contains: produit.origine, mode: 'insensitive' as const } }] : []),
  ];
  const candidatsSimilaires = await prisma.produit.findMany({
    where: { id: { not: produit.id }, actif: true, OR: pistesSimilaires },
    take: 12,
    include: { categorie: { select: { nom: true } }, avis: { select: { note: true } } },
  });
  const similaires = candidatsSimilaires
    .sort((a, b) => {
      const score = (candidat: (typeof candidatsSimilaires)[number]) =>
        Number(candidat.categorieId === produit.categorieId) * 2 +
        Number(Boolean(produit.origine && candidat.origine === produit.origine));
      return score(b) - score(a);
    })
    .slice(0, 4);
  const session = await getCurrentUser();
  const avisExistant = session
    ? produit.avis.some((avis) => avis.utilisateurId === Number(session.sub))
    : false;
  const achatLivre = session && !avisExistant
    ? await prisma.commande.findFirst({
        where: {
          utilisateurId: Number(session.sub),
          statut: 'LIVREE',
          lignes: { some: { produitId: produit.id } },
        },
        select: { id: true },
      })
    : null;
  const noteMoyenne = produit.avis.length
    ? produit.avis.reduce((somme, avis) => somme + avis.note, 0) / produit.avis.length
    : null;
  const video = VIDEOS_PRODUIT[produit.slug];
  const estNouveau =
    Date.now() - new Date(produit.creeLe).getTime() < 1000 * 60 * 60 * 24 * 45;
  // Nombre d'exemplaires déjà vendus (façon Jumia « X vendus »)
  const ventesAgg = await prisma.ligneCommande.aggregate({
    where: { produitId: produit.id, commande: { statut: { in: ['EXPEDIEE', 'LIVREE'] } } },
    _sum: { quantite: true },
  });
  const vendus = ventesAgg._sum.quantite ?? 0;

  // Estimation de livraison : commande avant 15 h (heure d'Abidjan) = J+1
  const heureAbidjan = new Date().getUTCHours();
  const delaiJours = heureAbidjan < 15 ? 1 : 2;
  const livraisonTexte = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Africa/Abidjan',
  }).format(new Date(Date.now() + delaiJours * 86400000));

  const estPopulaire = produit.avis.length >= 2 || noteMoyenne !== null;

  return (
    <div className="conteneur py-8 sm:py-10">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/produits" className="hover:text-marque-700">Catalogue</Link>
        <span>/</span>
        <Link href={`/produits?categorie=${produit.categorie.slug}`} className="hover:text-marque-700">
          {produit.categorie.nom}
        </Link>
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-premium ring-1 ring-marque-100/70">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 sm:aspect-square">
            <VisuelProduit src={produit.image} alt={produit.nom} className="h-full w-full object-cover" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {estNouveau && (
                <span className="badge bg-foret-600 text-white shadow">Nouveau</span>
              )}
              {estPopulaire && (
                <span className="badge bg-marque-500 text-white shadow">Populaire</span>
              )}
              {produit.stock > 0 && produit.stock <= 5 && (
                <span className="badge bg-amber-400 text-terre shadow">Plus que {produit.stock}</span>
              )}
              {produit.ancienPrix && Number(produit.ancienPrix) > Number(produit.prix) && (
                <span className="badge bg-rose-600 text-white shadow">Promo</span>
              )}
            </div>

            {produit.origine && (
              <Link
                href={`/produits?origine=${encodeURIComponent(produit.origine)}`}
                className="absolute bottom-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-terre shadow-lg backdrop-blur transition hover:bg-white"
              >
                <span aria-hidden="true">⌖</span>
                <span className="truncate">Origine : {produit.origine}</span>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs text-slate-500 sm:p-5">
            <span className="font-semibold uppercase tracking-wide text-foret-700">100 % Côte d’Ivoire</span>
            <span>{produit.categorie.nom}</span>
          </div>

          {video && <div className="px-4 pb-5 sm:px-5"><VideoProduit {...video} /></div>}
        </div>

        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-3xl bg-white p-5 shadow-carte ring-1 ring-marque-100/70 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-marque-600">{produit.categorie.nom}</p>
            <h1 className="titre mt-2 text-3xl font-extrabold sm:text-4xl">{produit.nom}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              {noteMoyenne !== null ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 ring-1 ring-amber-200">
                  <Etoiles note={noteMoyenne} taille="sm" />
                  <span className="text-xs font-extrabold text-amber-900">{noteMoyenne.toFixed(1)}</span>
                  <span className="text-xs font-normal text-slate-500">({produit.avis.length} avis)</span>
                </span>
              ) : (
                <p className="text-sm text-slate-500">Soyez le premier à noter ce produit</p>
              )}
              {vendus > 0 && (
                <span className="rounded-full bg-foret-50 px-2.5 py-1 text-xs font-bold text-foret-700">
                  {vendus} vendus
                </span>
              )}
              <a href="#avis" className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-marque-700 hover:underline">
                Lire les avis
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-y border-marque-100 py-4">
              <div>
                <p className="font-titre text-3xl font-extrabold text-marque-700 sm:text-4xl">{formatPrix(produit.prix)}</p>
                {produit.ancienPrix && Number(produit.ancienPrix) > Number(produit.prix) && (
                  <p className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-400 line-through">{formatPrix(produit.ancienPrix)}</span>
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
                      -{Math.round(((Number(produit.ancienPrix) - Number(produit.prix)) / Number(produit.ancienPrix)) * 100)}%
                    </span>
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">Prix TTC · livraison offerte dès 50 000 FCFA</p>
                <p className="mt-1 text-[11px] font-semibold text-foret-700">
                  🚚 Commandez avant 15 h : livré <strong>{livraisonTexte}</strong> à Abidjan
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  produit.stock > 0
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {produit.stock > 0 ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>

            <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-700">{produit.description}</p>

            {(produit.origine || produit.artisan || produit.matiere) && (
              <dl className="mt-5 grid gap-3 rounded-2xl bg-ivoire p-4 text-sm sm:grid-cols-3">
                {produit.origine && (
                  <div>
                    <dt className="text-xs uppercase text-slate-500">Origine</dt>
                    <dd>
                      <Link className="font-semibold text-terre hover:text-marque-700 hover:underline" href={`/produits?origine=${encodeURIComponent(produit.origine)}`}>
                        {produit.origine}
                      </Link>
                    </dd>
                  </div>
                )}
                {produit.artisan && (
                  <div>
                    <dt className="text-xs uppercase text-slate-500">Producteur</dt>
                    <dd>
                      <Link className="font-semibold text-terre hover:text-marque-700 hover:underline" href={`/produits?q=${encodeURIComponent(produit.artisan)}`}>
                        {produit.artisan}
                      </Link>
                    </dd>
                  </div>
                )}
                {produit.matiere && (
                  <div>
                    <dt className="text-xs uppercase text-slate-500">Matière</dt>
                    <dd>
                      <Link className="font-semibold text-terre hover:text-marque-700 hover:underline" href={`/produits?q=${encodeURIComponent(produit.matiere)}`}>
                        {produit.matiere}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-6">
              <BoutonAjout
                avecQuantite
                produit={{
                  produitId: produit.id,
                  nom: produit.nom,
                  slug: produit.slug,
                  prix: Number(produit.prix),
                  image: produit.image,
                  stock: produit.stock,
                }}
              />
            </div>

            {produit.stock > 0 && produit.stock <= 8 && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                ⚡ Plus que {produit.stock} en stock — les commandes partent dans l’ordre d’arrivée.
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[#c25c00] ring-1 ring-orange/30">Orange Money</span>
              <span className="rounded-full bg-mtn/20 px-2.5 py-1 text-[#7a5c00] ring-1 ring-mtn/50">MTN MoMo</span>
              <span className="rounded-full bg-wave/10 px-2.5 py-1 text-[#0a7fa8] ring-1 ring-wave/30">Wave</span>
              <span className="rounded-full bg-foret-50 px-2.5 py-1 text-foret-700 ring-1 ring-foret-200">Paiement à la livraison</span>
            </div>

            <div className="mt-4 grid gap-2 rounded-2xl border border-foret-100 bg-foret-50/60 p-4 text-xs text-foret-900 sm:grid-cols-2">
              <p>✓ Livraison Abidjan en 24 h</p>
              <p>✓ Retrait possible à Adjamé</p>
              <p>✓ Colis soigné, produit sous vide si frais</p>
              <p>✓ Service client à Abidjan</p>
            </div>
          </div>
        </div>
      </div>

      <section id="avis" className="mt-12 scroll-mt-28">
        <p className="text-xs font-bold uppercase tracking-widest text-marque-600">Retours de la communauté</p>
        <h2 className="titre mt-1 text-2xl font-extrabold">Notes et avis clients</h2>
        <div className="mt-4">
          <ResumeAvis
            produitNom={produit.nom}
            avis={produit.avis.map((a) => ({
              id: a.id,
              note: a.note,
              titre: a.titre,
              commentaire: a.commentaire,
              creeLe: a.creeLe.toISOString(),
              achatVerifie: a.achatVerifie,
              auteur: a.utilisateur.nom,
            }))}
          />
        </div>
        {session && !avisExistant && achatLivre && <FormulaireAvis produitId={produit.id} />}
        {session && !avisExistant && !achatLivre && (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600 ring-1 ring-marque-100/70">
            Le formulaire d’avis s’ouvrira dès que ce produit vous aura été livré.
          </p>
        )}
        {!session && (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600 ring-1 ring-marque-100/70">
            <Link href="/connexion" className="font-semibold text-marque-700 hover:underline">Connectez-vous</Link>{' '}
            après une livraison pour laisser un avis.
          </p>
        )}
      </section>

      {similaires.length > 0 && (
        <section className="mt-16">
          <p className="text-xs font-bold uppercase tracking-widest text-marque-600">À découvrir aussi</p>
          <h2 className="titre mt-1 text-2xl font-extrabold">Dans le même esprit</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similaires.map((p) => (
              <ProduitCarte key={p.id} produit={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
