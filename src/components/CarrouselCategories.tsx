'use client';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export type CategorieVitrine = {
  id: number;
  nom: string;
  slug: string;
  nbProduits: number;
  image: string;
  accroche: string;
};

/** Carrousel de catégories avec photo de couverture, autoplay rapide (2,8 s). */
export function CarrouselCategories({ categories }: { categories: CategorieVitrine[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-9">
      <div className="conteneur">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="mb-1 inline-flex rounded-full bg-foret-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-foret-700">
              Nos univers
            </span>
            <h2 className="titre text-2xl font-extrabold sm:text-3xl">Qu’est-ce qu’on mange aujourd’hui ?</h2>
          </div>
          <Link href="/produits" className="text-sm font-bold text-marque-700 hover:underline">
            Tout voir →
          </Link>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={14}
          slidesPerView={2.2}
          speed={480}
          autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation
          loop={categories.length > 4}
          breakpoints={{
            640: { slidesPerView: 3.2, spaceBetween: 14 },
            900: { slidesPerView: 4.2, spaceBetween: 16 },
            1200: { slidesPerView: 5, spaceBetween: 16 },
          }}
        >
          {categories.map((c) => (
            <SwiperSlide key={c.id}>
              <Link
                href={`/produits?categorie=${c.slug}`}
                className="group relative block h-44 overflow-hidden rounded-2xl bg-slate-200 shadow-carte ring-1 ring-marque-100/70 sm:h-52"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.nom}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-terre/90 via-terre/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-sm font-extrabold leading-tight text-white">{c.nom}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75">{c.accroche}</p>
                  <p className="mt-1 inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    {c.nbProduits} article{c.nbProduits > 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
