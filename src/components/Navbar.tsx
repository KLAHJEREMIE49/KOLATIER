'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePanier } from '@/store/cart';
import { useFavoris } from '@/store/favoris';
import { ANNONCES } from '@/lib/media';
import { LogoK } from './LogoK';
import { BarreRecherche } from './BarreRecherche';

type NavUser = { nom: string; role: 'CLIENT' | 'ADMIN' } | null;

const MENU = [
  { href: '/', label: 'Accueil' },
  { href: '/produits', label: 'Produits' },
  { href: '/produits?tri=promo', label: 'Promos', chaud: true },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

const CATEGORIES_MENU = [
  { href: '/produits?categorie=epicerie', label: 'Épicerie & marché' },
  { href: '/produits?categorie=plats-ivoiriens', label: 'Plats ivoiriens' },
  { href: '/produits?categorie=mode-pagnes', label: 'Pagnes & Mode' },
  { href: '/produits?categorie=artisanat', label: 'Artisanat' },
  { href: '/produits?categorie=beaute', label: 'Beauté naturelle' },
  { href: '/produits?categorie=maison', label: 'Maison & déco' },
];

const LIENS_PIED = [
  { href: '/livraison-paiement', label: 'Livraison & Mobile Money' },
  { href: '/faq', label: 'FAQ' },
  { href: '/cgv', label: 'CGV' },
];

function Icone({ nom, className = 'h-5 w-5' }: { nom: 'coeur' | 'compte' | 'panier'; className?: string }) {
  if (nom === 'coeur') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 20.4 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13Z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (nom === 'compte') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 4h2.2l2.4 11h9.6l2.2-8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}

/** Header premium : recherche centrale, compte, favoris, panier, menu déroulant catégories. */
export function Navbar({ user }: { user: NavUser }) {
  const router = useRouter();
  const [monte, setMonte] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const articles = usePanier((s) => s.articles);
  const favoris = useFavoris((s) => s.articles);
  const nombre = articles.reduce((t, a) => t + a.quantite, 0);

  useEffect(() => setMonte(true), []);
  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 12);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  async function deconnexion() {
    await fetch('/api/auth/deconnexion', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow ${
        defile ? 'bg-white/95 shadow-carte backdrop-blur' : 'bg-white'
      }`}
    >
      <div className="bande-ci" />

      {/* Bandeau d'annonces */}
      <div className="overflow-hidden bg-terre py-1.5">
        <div className="bandeau-defilant gap-8 whitespace-nowrap text-[11px] font-semibold text-marque-100">
          {[...ANNONCES, ...ANNONCES].map((annonce, i) => (
            <span key={`${annonce}-${i}`} className="flex items-center gap-8">
              {annonce}
              <span aria-hidden="true" className="text-marque-500">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="conteneur">
        {/* Ligne principale : logo · recherche · actions */}
        <div className="flex h-16 items-center gap-3 lg:h-[72px] lg:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 font-titre text-xl font-bold tracking-tight text-terre">
            <LogoK />
            <span className="leading-none">
              Kolatier
              <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-[0.18em] text-marque-700">
                Côte d’Ivoire
              </span>
            </span>
          </Link>

          <div className="mx-auto hidden w-full max-w-xl lg:block">
            <BarreRecherche />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <Link
              href="/favoris"
              className="relative hidden items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-marque-50 hover:text-terre sm:flex"
            >
              <Icone nom="coeur" />
              <span className="hidden md:inline">Favoris</span>
              {monte && favoris.length > 0 && (
                <motion.span
                  key={favoris.length}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white"
                >
                  {favoris.length}
                </motion.span>
              )}
            </Link>

            {user ? (
              <Link
                href="/compte"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-marque-50 hover:text-terre sm:flex"
                title={user.nom}
              >
                <Icone nom="compte" />
                <span className="hidden max-w-[7rem] truncate md:inline">{user.nom.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/connexion"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-marque-50 hover:text-terre sm:flex"
              >
                <Icone nom="compte" />
                <span className="hidden md:inline">Connexion</span>
              </Link>
            )}

            <Link
              href="/panier"
              className="relative flex items-center gap-2 rounded-xl bg-gradient-to-b from-marque-500 to-marque-600 px-3.5 py-2.5 text-[13px] font-extrabold text-white shadow-sm transition hover:from-marque-600 hover:to-marque-700"
            >
              <Icone nom="panier" />
              <span className="hidden sm:inline">Panier</span>
              <motion.span
                key={nombre}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-extrabold text-marque-700"
              >
                {monte ? nombre : 0}
              </motion.span>
            </Link>

            <button
              className="grid h-10 w-10 place-items-center rounded-xl text-lg text-terre ring-1 ring-marque-100 transition hover:bg-marque-50 lg:hidden"
              aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOuvert}
              onClick={() => setMenuOuvert((v) => !v)}
            >
              {menuOuvert ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Recherche mobile */}
        <div className="pb-3 lg:hidden">
          <BarreRecherche compact />
        </div>
      </div>

      {/* Rangée de navigation desktop */}
      <div className="hidden border-t border-marque-100/80 bg-ivoire/70 lg:block">
        <div className="conteneur flex h-11 items-center justify-between">
          <nav className="flex items-center gap-0.5">
            <div className="group relative">
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold text-terre transition hover:bg-marque-50">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-marque-600" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
                </svg>
                Catégories
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 rounded-2xl bg-white p-2 opacity-0 shadow-premium ring-1 ring-marque-100 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {CATEGORIES_MENU.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-marque-50 hover:text-terre"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {MENU.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition hover:bg-marque-50 hover:text-terre ${
                  l.chaud ? 'text-rose-600' : 'text-slate-700'
                }`}
              >
                {l.chaud && <span aria-hidden="true">🔥 </span>}
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="flex items-center gap-1">
            {LIENS_PIED.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 transition hover:text-marque-700"
              >
                {l.label}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="rounded-lg bg-foret-50 px-2.5 py-2 text-xs font-bold text-foret-700 hover:bg-foret-100">
                Administration
              </Link>
            )}
            {user && (
              <Link href="/commandes" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-marque-700">
                Mes commandes
              </Link>
            )}
            {user ? (
              <button onClick={deconnexion} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                Déconnexion
              </button>
            ) : (
              <Link href="/inscription" className="rounded-lg px-2.5 py-2 text-xs font-bold text-marque-700 hover:underline">
                Créer un compte
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="max-h-[75vh] overflow-y-auto border-t border-marque-100 bg-white lg:hidden"
        >
          <div className="conteneur grid gap-1 py-3">
            {MENU.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOuvert(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-700 hover:bg-marque-50"
              >
                {l.label}
              </Link>
            ))}
            <p className="mt-2 px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Catégories</p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES_MENU.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setMenuOuvert(false)}
                  className="rounded-lg bg-marque-50/60 px-2 py-2 text-xs font-semibold text-marque-800"
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <Link href="/favoris" onClick={() => setMenuOuvert(false)} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                ♥ Mes favoris ({monte ? favoris.length : 0})
              </Link>
              {LIENS_PIED.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOuvert(false)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {l.label}
                </Link>
              ))}
              {user && (
                <Link href="/commandes" onClick={() => setMenuOuvert(false)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  Mes commandes
                </Link>
              )}
            </div>
            {user ? (
              <button onClick={deconnexion} className="mt-2 rounded-lg px-2 py-2.5 text-left text-sm font-semibold text-rose-600">
                Déconnexion
              </button>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/connexion" onClick={() => setMenuOuvert(false)} className="bouton-secondaire">
                  Connexion
                </Link>
                <Link href="/inscription" onClick={() => setMenuOuvert(false)} className="bouton-primaire">
                  S’inscrire
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
