'use client';

export default function ErreurCatalogue({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="conteneur py-16">
      <div className="carte mx-auto max-w-xl p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-marque-600">Catalogue Kolatier</p>
        <h1 className="titre mt-2 text-2xl font-bold">Le catalogue est momentanément indisponible.</h1>
        <p className="mt-3 text-sm text-slate-600">Une erreur est survenue pendant le chargement des produits. Réessayez dans un instant.</p>
        <button type="button" onClick={reset} className="bouton-primaire mt-5">Réessayer</button>
      </div>
    </div>
  );
}
