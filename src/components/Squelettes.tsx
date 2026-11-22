/** Squelettes de chargement réutilisables (aucune image, aucune requête). */

export function CarteProduitSquelette() {
  return (
    <div className="carte overflow-hidden">
      <div className="squelette aspect-[4/3] w-full" />
      <div className="space-y-2 p-4">
        <div className="squelette h-3 w-1/3 rounded" />
        <div className="squelette h-4 w-4/5 rounded" />
        <div className="squelette h-5 w-2/5 rounded" />
        <div className="squelette h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function GrilleSquelettes({ nombre = 8 }: { nombre?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: nombre }).map((_, i) => (
        <CarteProduitSquelette key={i} />
      ))}
    </div>
  );
}

export function BlocTexteSquelette({ lignes = 4 }: { lignes?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lignes }).map((_, i) => (
        <div key={i} className="squelette h-4 rounded" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}
