import { FormulaireContact } from '@/components/FormulaireContact';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="conteneur py-10">
      <h1 className="titre text-3xl font-bold">Contactez Kolatier</h1>
      <p className="mt-2 text-slate-600">Une question sur les produits ou votre commande ? Écrivez-nous.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <FormulaireContact />
        <aside className="carte h-fit p-5">
          <h2 className="font-bold text-terre">Nos coordonnées</h2>
          <p className="mt-3 text-sm text-slate-600">Cocody Riviera, Abidjan<br />contact@kolatier.ci<br />+225 07 00 00 00 00</p>
          <a className="bouton-primaire mt-4" href="https://wa.me/2250709884512" target="_blank" rel="noreferrer">Nous écrire sur WhatsApp</a>
          <h3 className="mt-6 font-semibold text-terre">Horaires d’ouverture</h3>
          <p className="mt-2 text-sm text-slate-600">Du lundi au vendredi : 9 h – 17 h<br />Samedi : 9 h – 13 h<br />Dimanche et jours fériés : fermé</p>
          <p className="mt-4 text-xs text-slate-500">Coordonnées et horaires fournis à titre de démonstration pédagogique.</p>
        </aside>
      </div>
    </div>
  );
}
