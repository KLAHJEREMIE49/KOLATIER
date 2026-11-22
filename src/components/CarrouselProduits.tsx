'use client';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProduitCarte, type ProduitAffiche } from './ProduitCarte';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Props = {
  produits: ProduitAffiche[];
  titre: string;
  sousTitre?: string;
  lien?: { href: string; label: string };
  /** Délai d'autoplay en ms (0 = pas d'autoplay). */
  delai?: number;
  sombre?: boolean;
  badge?: string;
};

/** Carrousel de produits : autoplay rapide (3 s), glissement court, pagination et flèches. */
export function CarrouselProduits({
  produits,
  titre,
  sousTitre,
  lien,
  delai = 3000,
  sombre = false,
  badge,
}: Props) {
  if (produits.length === 0) return null;

  return (
    <section className={sombre ? 'bg-terre py-12' : 'py-9'}>
      <div className="conteneur">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            {badge && (
              <span className="mb-1 inline-flex rounded-full bg-marque-500/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-marque-700">
                {badge}
              </span>
            )}
            <h2 className={`titre text-2xl font-extrabold sm:text-3xl ${sombre ? 'text-ivoire' : 'text-terre'}`}>
              {titre}
            </h2>
            {sousTitre && (
              <p className={`mt-1 max-w-2xl text-sm ${sombre ? 'text-ivoire/70' : 'text-slate-600'}`}>{sousTitre}</p>
            )}
          </div>
          {lien && (
            <a
              href={lien.href}
              className={`text-sm font-bold hover:underline ${sombre ? 'text-marque-300' : 'text-marque-700'}`}
            >
              {lien.label} →
            </a>
          )}
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={14}
          slidesPerView={1.6}
          speed={480}
          autoplay={delai ? { delay: delai, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          pagination={{ clickable: true }}
          navigation
          loop={produits.length > 4}
          breakpoints={{
            480: { slidesPerView: 2.1, spaceBetween: 14 },
            640: { slidesPerView: 2.6, spaceBetween: 14 },
            900: { slidesPerView: 3.4, spaceBetween: 16 },
            1200: { slidesPerView: 4.2, spaceBetween: 18 },
          }}
        >
          {produits.map((produit) => (
            <SwiperSlide key={produit.id} className="pb-2">
              <ProduitCarte produit={produit} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
