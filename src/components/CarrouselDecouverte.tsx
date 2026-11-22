'use client';

import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';
import { VisuelProduit } from '@/components/VisuelProduit';

export type DiapositiveDecouverte = {
  titre: string;
  texte: string;
  lien: string;
  etiquette: string;
  classe: string;
  image?: string;
};

export function CarrouselDecouverte({ slides }: { slides: DiapositiveDecouverte[] }) {
  const [actuelle, setActuelle] = useState(0);
  const debutTactile = useRef<number | null>(null);
  if (slides.length === 0) return null;

  function precedente() {
    setActuelle((index) => (index - 1 + slides.length) % slides.length);
  }
  function suivante() {
    setActuelle((index) => (index + 1) % slides.length);
  }

  function naviguerAuClavier(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      precedente();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      suivante();
    }
  }

  const slide = slides[actuelle];
  return (
    <section
      role="region"
      aria-roledescription="carrousel"
      aria-label="Découvrir Kolatier"
      tabIndex={0}
      className="conteneur py-10"
      onKeyDown={naviguerAuClavier}
      onTouchStart={(event) => { debutTactile.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (debutTactile.current === null) return;
        const fin = event.changedTouches[0]?.clientX ?? debutTactile.current;
        const ecart = fin - debutTactile.current;
        if (Math.abs(ecart) > 45) ecart > 0 ? precedente() : suivante();
        debutTactile.current = null;
      }}
    >
      <div
        role="group"
        aria-roledescription="diapositive"
        aria-label={`${slide.titre}, diapositive ${actuelle + 1} sur ${slides.length}`}
        aria-live="polite"
        className={`relative min-h-80 overflow-hidden rounded-2xl p-6 text-white transition-colors duration-300 sm:min-h-[26rem] sm:p-10 ${slide.classe}`}
      >
        {slide.image && (
          <div className="absolute inset-0">
            <VisuelProduit src={slide.image} alt="" priority={actuelle === 0} className="h-full w-full object-cover opacity-35" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-terre/80 via-terre/50 to-transparent" />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">{slide.etiquette}</p>
          <h2 className="mt-3 font-titre text-3xl font-bold sm:text-5xl">{slide.titre}</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-white/90">{slide.texte}</p>
          <Link href={slide.lien} className="mt-6 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-terre shadow-sm">
            Découvrir
          </Link>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full border-[28px] border-white/10" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2" aria-label="Choisir une diapositive">
          {slides.map((item, index) => (
            <button
              key={item.titre}
              type="button"
              aria-label={`Afficher ${item.titre}`}
              aria-current={index === actuelle ? 'true' : undefined}
              onClick={() => setActuelle(index)}
              className={`h-2.5 rounded-full transition ${index === actuelle ? 'w-8 bg-marque-600' : 'w-2.5 bg-slate-300'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Diapositive précédente" onClick={precedente} className="bouton-secondaire px-3">←</button>
          <button type="button" aria-label="Diapositive suivante" onClick={suivante} className="bouton-secondaire px-3">→</button>
        </div>
      </div>
    </section>
  );
}
