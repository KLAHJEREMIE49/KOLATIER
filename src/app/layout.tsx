import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    default: "Kolatier — Le meilleur de la Côte d'Ivoire, livré chez vous",
    template: '%s · Kolatier',
  },
  description:
    "Boutique en ligne ivoirienne : attiéké, pagne wax, huile de palme, poisson fumé, karité et artisanat made in Côte d'Ivoire. Paiement Orange Money, MTN MoMo, Wave et Moov Money. Livraison Abidjan en 24 h.",
  applicationName: 'Kolatier',
  keywords: ['attiéké', 'pagne wax', 'karité', 'Côte d’Ivoire', 'Abidjan', 'boutique en ligne', 'Mobile Money'],
};

export const viewport: Viewport = {
  themeColor: '#f77f00',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="fr-CI">
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar user={user ? { nom: user.nom, role: user.role } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
