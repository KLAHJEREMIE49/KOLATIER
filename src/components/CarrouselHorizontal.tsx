'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  label: string;
  enfants: ReactNode;
  classeElement: string;
  classePiste?: string;
};

export function CarrouselHorizontal({ label, enfants, classeElement, classePiste = '' }: Props) {
  const piste = useRef<HTMLDivElement>(null);
  const [defilement, setDefilement] = useState({ gauche: false, droite: false });
  const elements = Array.isArray(enfants) ? enfants : [enfants];

  function actualiserDefilement() {
    const element = piste.current;
    if (!element) return;
    setDefilement({
      gauche: element.scrollLeft > 1,
      droite: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    });
  }

  useEffect(() => {
    const element = piste.current;
    if (!element) return;

    actualiserDefilement();
    const observateur = new ResizeObserver(actualiserDefilement);
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  function defiler(direction: -1 | 1) {
    const element = piste.current;
    if (!element) return;
    const reduireMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.85,
      behavior: reduireMouvement ? 'auto' : 'smooth',
    });
  }

  function naviguerAuClavier(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName))) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      defiler(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          aria-label={`Faire défiler ${label} vers la gauche`}
          onClick={() => defiler(-1)}
          disabled={!defilement.gauche}
          className="bouton-secondaire h-10 w-10 px-0 disabled:opacity-40"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          aria-label={`Faire défiler ${label} vers la droite`}
          onClick={() => defiler(1)}
          disabled={!defilement.droite}
          className="bouton-secondaire h-10 w-10 px-0 disabled:opacity-40"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div
        ref={piste}
        role="region"
        aria-label={label}
        aria-roledescription="carrousel"
        tabIndex={0}
        onKeyDown={naviguerAuClavier}
        onScroll={actualiserDefilement}
        className={`carrousel-piste flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marque-500 ${classePiste}`}
      >
        {elements.map((element, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${elements.length}`}
            className={`shrink-0 snap-start ${classeElement}`}
          >
            {element}
          </div>
        ))}
      </div>
    </div>
  );
}
