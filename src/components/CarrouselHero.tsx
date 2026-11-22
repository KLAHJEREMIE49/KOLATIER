'use client';

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HERO_SLIDES } from '@/lib/media';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/** Hero premium : photo plein cadre, accroche forte, CTA, prix d'appel et preuves de confiance. */
export function CarrouselHero() {
  return (
    <section className="relative bg-white">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={520}
        loop
        autoplay={{ delay: 3200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="hero-swiper"
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.titre}>
            <div className="relative h-[72vh] min-h-[460px] w-full overflow-hidden sm:h-[78vh] lg:h-[76vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.titre}
                className="kenburns absolute inset-0 h-full w-full object-cover"
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-terre/92 via-terre/55 to-terre/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-terre/85 via-transparent to-transparent" />

              <div className="conteneur relative flex h-full flex-col justify-center pb-24 pt-8 sm:pb-28">
                <motion.div
                  key={slide.titre}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-2xl"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white ring-1 ring-white/30 backdrop-blur">
                    🇨🇮 {slide.surtitre}
                  </span>

                  <h1 className="titre mt-4 text-[2.1rem] font-extrabold leading-[1.02] text-white drop-shadow-lg sm:text-5xl lg:text-[3.4rem]">
                    {slide.titre}
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{slide.texte}</p>

                  {slide.prix && (
                    <div className="mt-4 inline-flex items-baseline gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/25 backdrop-blur">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-marque-200">Dès</span>
                      <span className="font-titre text-2xl font-extrabold text-white">{slide.prix}</span>
                      <span className="text-[11px] text-white/70">· livraison 24 h à Abidjan</span>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <Link
                      href={slide.cta.href}
                      className="bouton !bg-gradient-to-b !from-marque-500 !to-marque-600 !px-6 !py-3 text-sm font-extrabold text-white shadow-premium hover:!from-marque-600 hover:!to-marque-700"
                    >
                      {slide.cta.label}
                    </Link>
                    <Link
                      href="/produits?tri=promo"
                      className="bouton !bg-white/12 !px-5 !py-3 text-sm font-bold text-white ring-1 ring-white/40 backdrop-blur hover:!bg-white/25"
                    >
                      Voir les offres
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bandeau de confiance sous le hero */}
      <div className="conteneur relative z-10 -mt-12 pb-2">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-3 shadow-premium ring-1 ring-marque-100 sm:grid-cols-4 sm:gap-3 sm:p-4">
          {[
            { icon: '🚚', titre: 'Livraison 24 h', texte: 'Abidjan & banlieue' },
            { icon: '💳', titre: 'Mobile Money', texte: 'Wave · Orange · MTN · Moov' },
            { icon: '🇨🇮', titre: '100 % ivoirien', texte: 'Direct producteurs' },
            { icon: '↩️', titre: 'Retour 7 jours', texte: 'Satisfait ou remboursé' },
          ].map((i) => (
            <div key={i.titre} className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-marque-50 text-lg" aria-hidden="true">
                {i.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-extrabold text-terre">{i.titre}</p>
                <p className="truncate text-[10px] text-slate-500">{i.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
