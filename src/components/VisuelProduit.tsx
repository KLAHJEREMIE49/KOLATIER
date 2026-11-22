'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  src: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Visuel produit servi exclusivement depuis /public (fichier local).
 * Aucun domaine distant : l'application n'a pas besoin d'Internet pour afficher les images.
 */
export function VisuelProduit({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: Props) {
  const [indisponible, setIndisponible] = useState(false);

  if (!src || indisponible) {
    return (
      <div
        role="img"
        aria-label={`${alt} — visuel indisponible`}
        className={`grid h-full w-full place-items-center bg-gradient-to-br from-ivoire to-marque-50 text-center ${className}`}
      >
        <span className="px-4">
          <span aria-hidden="true" className="mx-auto block h-10 w-10 rounded-xl border-2 border-marque-300 bg-white/70" />
          <span className="mt-2 block text-xs font-semibold text-terre">Visuel indisponible</span>
        </span>
      </div>
    );
  }

  // Les SVG (visuels historiques) ne passent pas par l'optimiseur.
  const estSvg = src.toLowerCase().endsWith('.svg');

  return (
    <span className={`block h-full w-full ${wrapperClassName || 'relative'}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        unoptimized={estSvg}
        quality={82}
        className={className}
        onError={() => setIndisponible(true)}
      />
    </span>
  );
}
