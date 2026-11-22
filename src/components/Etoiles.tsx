/** Étoiles de notation, façon Jumia : note pleine/demi/vide. */
export function Etoiles({
  note,
  taille = 'sm',
  nombre = 5,
}: {
  note: number;
  taille?: 'xs' | 'sm' | 'md' | 'lg';
  nombre?: number;
}) {
  const classes: Record<string, string> = {
    xs: 'text-[11px]',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };
  return (
    <span className={`inline-flex items-center gap-0.5 ${classes[taille]}`} aria-label={`Note ${note.toFixed(1)} sur 5`}>
      {Array.from({ length: nombre }).map((_, i) => {
        const valeur = note - i;
        const pleine = valeur >= 0.75;
        const demie = !pleine && valeur >= 0.25;
        return (
          <span key={i} className={pleine || demie ? 'text-amber-500' : 'text-slate-300'} aria-hidden="true">
            {pleine ? '★' : demie ? '⯪' : '☆'}
          </span>
        );
      })}
    </span>
  );
}

/** Ligne compacte : étoiles + moyenne + nombre d'avis. */
export function NoteCompacte({ moyenne, total, taille = 'xs' }: { moyenne: number; total: number; taille?: 'xs' | 'sm' }) {
  if (total === 0) {
    return <span className="text-[11px] text-slate-400">Pas encore noté</span>;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Etoiles note={moyenne} taille={taille} />
      <span className="text-[11px] font-bold text-slate-700">{moyenne.toFixed(1)}</span>
      <span className="text-[11px] text-slate-400">({total})</span>
    </span>
  );
}
