import Link from 'next/link';
import { LogoK } from './LogoK';

const COMMUNES_LIVREES = ['Cocody', 'Yopougon', 'Abobo', 'Adjamé', 'Koumassi', 'Marcory', 'Treichville', 'Plateau', 'Port-Bouët', 'Attécoubé'];

export function Footer() {
  return (
    <footer className="mt-16 bg-terre text-marque-50">
      <div className="bande-ci" />
      <div className="conteneur grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoK taille={38} />
            <div>
              <p className="font-titre text-xl font-bold leading-none">Kolatier</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-marque-300">Côte d’Ivoire</p>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-marque-100/80">
            Comme la noix de cola qu’on offre pour souhaiter la bienvenue, Kolatier met en avant le
            savoir-faire ivoirien : attiéké, pagnes wax, karité, artisanat et épicerie, de Korhogo à
            San-Pédro.
          </p>
          <p className="mt-4 text-sm text-marque-100/80">
            Cocody Riviera 3, Abidjan · <a href="tel:+2252722445566" className="hover:text-marque-300">+225 27 22 44 55 66</a> ·{' '}
            <a href="mailto:contact@kolatier.ci" className="hover:text-marque-300">contact@kolatier.ci</a>
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave', 'Paiement à la livraison'].map((m) => (
              <span key={m} className="rounded-full bg-white/10 px-2.5 py-1">{m}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Boutique & services</p>
          <ul className="mt-2 space-y-1 text-sm text-marque-100/80">
            <li><Link href="/produits" className="hover:text-marque-300">Catalogue</Link></li>
            <li><Link href="/produits?categorie=epicerie" className="hover:text-marque-300">Épicerie & marché</Link></li>
            <li><Link href="/produits?categorie=mode-pagnes" className="hover:text-marque-300">Mode & pagnes</Link></li>
            <li><Link href="/panier" className="hover:text-marque-300">Panier</Link></li>
            <li><Link href="/commandes" className="hover:text-marque-300">Mes commandes</Link></li>
            <li><Link href="/livraison-paiement" className="hover:text-marque-300">Livraison & Mobile Money</Link></li>
            <li><Link href="/faq" className="hover:text-marque-300">Questions fréquentes</Link></li>
            <li><Link href="/contact" className="hover:text-marque-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Kolatier & compte</p>
          <ul className="mt-2 space-y-1 text-sm text-marque-100/80">
            <li><Link href="/a-propos" className="hover:text-marque-300">À propos</Link></li>
            <li><Link href="/connexion" className="hover:text-marque-300">Connexion</Link></li>
            <li><Link href="/inscription" className="hover:text-marque-300">Inscription</Link></li>
            <li><Link href="/compte" className="hover:text-marque-300">Mon profil</Link></li>
            <li><Link href="/mentions-legales" className="hover:text-marque-300">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-marque-300">Conditions générales de vente</Link></li>
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-marque-100/60">
            Livraison : {COMMUNES_LIVREES.join(' · ')} et tout l’intérieur du pays.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-marque-100/60">
        © {new Date().getFullYear()} Kolatier — Projet de Génie Logiciel · Fait avec fierté en Côte d’Ivoire 🇨🇮
      </div>
    </footer>
  );
}
