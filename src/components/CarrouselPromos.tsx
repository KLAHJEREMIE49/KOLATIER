'use client';

import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { PROMOS } from '@/lib/media';
import { formatPrix } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export type Promo = {
  titre: string;
  texte: string;
  image: string;
  prix: number;
  ancienPrix: number;
  href: string;
};

/** Bandeau promos : coverflow, autoplay 2,9 s, remise affichée et compte à rebours. */
export function CarrouselPromos({ promos = PROMOS as Promo[] }: { promos?: Promo[] }) {
  if (promos.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-[#2a1c12] via-terre to-[#5c2100] py-12">
      <div className="conteneur">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
              ⚡ Offres du moment
            </span>
            <h2 className="titre mt-2 text-2xl font-extrabold text-ivoire sm:text-3xl">
              Ne ratez pas ces prix
            </h2>
            <p className="mt-1 text-sm text-ivoire/70">Remises valables jusqu’à la fin de la journée.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-extrabold text-white">Jusqu’à −35 %</span>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={promos.length > 2}
          speed={520}
          autoplay={{ delay: 2900, disableOnInteraction: false, pauseOnMouseEnter: true }}
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 110, modifier: 1.4, slideShadows: false }}
          pagination={{ clickable: true }}
          navigation
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 1.8 },
            900: { slidesPerView: 2.4 },
            1200: { slidesPerView: 3 },
          }}
        >
          {promos.map((p) => {
            const remise = Math.round(((p.ancienPrix - p.prix) / p.ancienPrix) * 100);
            return (
              <SwiperSlide key={p.titre} className="pb-2">
                <Link
                  href={p.href}
                  className="group block overflow-hidden rounded-3xl bg-white shadow-premium ring-1 ring-white/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.titre}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-lg">
                      -{remise}%
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-extrabold text-terre">{p.titre}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">{p.texte}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-marque-700">{formatPrix(p.prix)}</span>
                      <span className="text-xs font-semibold text-slate-400 line-through">{formatPrix(p.ancienPrix)}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
