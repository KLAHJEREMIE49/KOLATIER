import { formatPrix } from '@/lib/utils';

export const metadata = { title: 'Livraison & Paiement' };

export default function LivraisonPaiementPage() {
  const zones = [
    ['Communes d’Abidjan', '24 h', '2 000 FCFA ou offerte dès 50 000 FCFA'],
    ['Grand-Bassam et villes proches', '24–48 h', '2 000 FCFA ou offerte dès 50 000 FCFA'],
    ['Intérieur du pays', '48–72 h', '2 000 FCFA ou offerte dès 50 000 FCFA'],
  ];
  const moyens = [
    ['Orange Money', 'Le paiement mobile Orange Money est simulé dans ce projet.'],
    ['MTN MoMo', 'Le paiement mobile MTN MoMo est simulé dans ce projet.'],
    ['Moov Money', 'Le paiement mobile Moov Money est simulé dans ce projet.'],
    ['Wave', 'Le paiement Wave est simulé dans ce projet.'],
    ['Paiement à la livraison', 'Le règlement au livreur est également simulé : aucune somme réelle n’est collectée.'],
  ];

  return (
    <div className="conteneur py-10">
      <h1 className="titre text-3xl font-bold">Livraison & Paiement</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Nous préparons vos commandes depuis Abidjan et desservons les communes et villes de Côte d&apos;Ivoire.</p>
      <div className="carte mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Zone</th><th className="px-4 py-3">Délai indicatif</th><th className="px-4 py-3">Tarif</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{zones.map(([zone, delai, tarif]) => <tr key={zone}><td className="px-4 py-3 font-semibold text-terre">{zone}</td><td className="px-4 py-3">{delai}</td><td className="px-4 py-3">{tarif}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-500">La livraison est offerte dès {formatPrix(50000)}. En dessous, les frais sont de {formatPrix(2000)}. Les délais sont indicatifs.</p>
      <h2 className="titre mt-10 text-2xl font-bold">Moyens de paiement</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {moyens.map(([titre, texte]) => <article key={titre} className="carte p-4"><h3 className="font-bold text-terre">{titre}</h3><p className="mt-1 text-sm text-slate-600">{texte}</p></article>)}
      </div>
      <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        Kolatier est une démonstration pédagogique. Aucun paiement n&apos;est transmis à un opérateur et aucune transaction réelle n&apos;est effectuée.
      </p>
    </div>
  );
}
