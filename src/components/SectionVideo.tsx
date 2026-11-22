'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { VIDEOS, POSTERS } from '@/lib/media';

/**
 * Section vidéo d'accueil : clip court (8 s) en boucle, sans son par défaut,
 * servit depuis /public/videos. Boutons pause et son.
 */
export function SectionVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const enVue = useInView(ref, { once: false, margin: '-100px' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muet, setMuet] = useState(true);
  const [lecture, setLecture] = useState(true);

  function basculerSon() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muet;
    setMuet(!muet);
  }

  function basculerLecture() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setLecture(true);
    } else {
      v.pause();
      setLecture(false);
    }
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-terre py-12">
      <div className="conteneur grid items-center gap-7 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={enVue ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl shadow-premium ring-1 ring-marque-500/30"
        >
          <video
            ref={videoRef}
            className="aspect-video h-full w-full object-cover"
            src={VIDEOS.ambiance}
            poster={POSTERS.ambiance}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Ambiance du marché ivoirien : attiéké, légumes frais, poisson fumé"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-terre/70 via-transparent to-transparent" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow">
              ● En direct du marché
            </span>
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur">
              8 s en boucle
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={basculerLecture}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-terre shadow-lg transition hover:scale-110"
              aria-label={lecture ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}
            >
              {lecture ? '❚❚' : '▶'}
            </button>
            <button
              type="button"
              onClick={basculerSon}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-terre shadow-lg transition hover:scale-110"
              aria-label={muet ? 'Activer le son' : 'Couper le son'}
            >
              {muet ? '🔇' : '🔊'}
            </button>
          </div>
        </motion.div>

        <div className="text-ivoire">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ring-1 ring-white/25">
            Dans nos marchés
          </span>
          <h2 className="titre mt-3 text-2xl font-extrabold sm:text-3xl">
            L’ambiance d’Adjamé, sans le trafic
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ivoire/75">
            Légumes cueillis la veille, poisson fumé sur claies de bois, attiéké préparé au village :
            nos équipes passent au marché chaque matin pour vous, puis livrent à Abidjan en 24 h.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ivoire/85">
            <li>✓ Sélection chez les producteurs, prix affichés en FCFA</li>
            <li>✓ Paiement Orange Money, MTN MoMo, Wave ou à la livraison</li>
            <li>✓ Colis soignés, produits frais sous vide</li>
          </ul>
          <a href="/produits" className="bouton-primaire mt-5">
            Voir les produits frais
          </a>
        </div>
      </div>
    </section>
  );
}

/** Petite vidéo de fiche produit : lecture auto, courte, sans son. */
export function VideoProduit({ src, poster, titre }: { src: string; poster: string; titre: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muet, setMuet] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/5 ring-1 ring-marque-100">
      <video
        ref={videoRef}
        className="aspect-video w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={titre}
      />
      <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
        ● {titre}
      </span>
      <button
        type="button"
        onClick={() => {
          const v = videoRef.current;
          if (!v) return;
          v.muted = !muet;
          setMuet(!muet);
        }}
        className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-xs shadow"
        aria-label={muet ? 'Activer le son' : 'Couper le son'}
      >
        {muet ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
