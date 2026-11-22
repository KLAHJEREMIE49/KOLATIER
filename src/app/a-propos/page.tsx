import Link from 'next/link';

export const metadata = { title: 'À propos de Kolatier' };

export default function AProposPage() {
  const valeurs = [
    ['Authenticité', 'Des produits sourcés auprès de créateurs et de producteurs ivoiriens.'],
    ['Équité', 'Une meilleure visibilité pour les ateliers et coopératives locales.'],
    ['Transmission', 'Mettre en lumière des gestes, des matières et des histoires de nos régions.'],
  ];

  return (
    <div className="conteneur py-10">
      <p className="badge bg-foret-50 text-foret-700 ring-foret-200">🇨🇮 Notre histoire</p>
      <h1 className="titre mt-4 text-4xl font-bold">Akwaba chez Kolatier</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="carte p-6 leading-relaxed text-slate-700">
          <h2 className="font-titre text-2xl font-bold text-terre">Un symbole de bienvenue</h2>
          <p className="mt-3">
            En Côte d&apos;Ivoire, la noix de cola est un présent d&apos;hospitalité, de respect et de partage.
            Kolatier s&apos;inspire de cette tradition pour rapprocher les savoir-faire ivoiriens des personnes
            qui souhaitent les découvrir, d&apos;Abidjan aux autres régions du pays.
          </p>
          <h2 className="mt-6 font-titre text-2xl font-bold text-terre">Notre mission</h2>
          <p className="mt-3">
            Faire connaître les créations, les produits du terroir et les talents locaux grâce à une boutique
            en ligne simple, avec des prix en francs CFA et une livraison pensée pour la Côte d&apos;Ivoire.
          </p>
        </section>
        <section className="rounded-xl bg-terre p-6 text-marque-50">
          <h2 className="font-titre text-2xl font-bold">Nos valeurs</h2>
          <ul className="mt-4 space-y-4">
            {valeurs.map(([titre, texte]) => (
              <li key={titre}>
                <strong className="text-marque-300">{titre}</strong>
                <p className="mt-1 text-sm text-marque-100/80">{texte}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="mt-10">
        <h2 className="titre text-2xl font-bold">Nos artisans partenaires</h2>
        <p className="mt-2 text-slate-600">Une sélection inspirée des savoir-faire de plusieurs villes ivoiriennes.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['Korhogo', 'Toiles peintes, sculpture et créations du Nord.'],
            ['Man', 'Produits agricoles et savoir-faire de l’Ouest.'],
            ['Bouaké', 'Tissage kita, accessoires et artisanat baoulé.'],
            ['Grand-Bassam', 'Vannerie, raphia et matières du littoral.'],
            ['San-Pédro', 'Cacao et produits du terroir du Sud-Ouest.'],
          ].map(([ville, texte]) => (
            <article key={ville} className="carte p-4">
              <h3 className="font-bold text-terre">{ville}</h3>
              <p className="mt-1 text-sm text-slate-600">{texte}</p>
            </article>
          ))}
        </div>
      </section>
      <Link href="/produits" className="bouton-primaire mt-8">Découvrir leurs produits</Link>
      <p className="mt-8 text-xs text-slate-500">Kolatier est un projet pédagogique réalisé dans le cadre d&apos;un projet de Génie Logiciel en Licence 3.</p>
    </div>
  );
}
