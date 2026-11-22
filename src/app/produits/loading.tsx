export default function ChargementCatalogue() {
  return (
    <div className="conteneur py-10" aria-busy="true" aria-live="polite">
      <h1 className="titre text-3xl font-bold">Catalogue</h1>
      <p className="mt-2 text-sm text-slate-600">Recherche des produits ivoiriens…</p>
      <div className="carte mt-6 h-32 animate-pulse bg-white" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="carte overflow-hidden">
            <div className="aspect-[4/3] animate-pulse bg-marque-50" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
