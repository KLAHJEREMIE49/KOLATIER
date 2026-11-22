import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-a-remplacer-en-production-32-caracteres'
);

/**
 * Protection des routes au niveau Edge :
 *  - /admin/**  -> réservé au rôle ADMIN
 *  - /compte, /commandes, /commande -> utilisateur connecté
 * Le contrôle "compte bloqué" est refait côté serveur (accès BDD) dans getCurrentUser().
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('session')?.value;

  const besoinAuth =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/compte') ||
    pathname.startsWith('/commandes') ||
    pathname.startsWith('/commande');

  if (!besoinAuth) return NextResponse.next();

  if (!token) {
    const url = new URL('/connexion', req.url);
    url.searchParams.set('suivant', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  } catch {
    const url = new URL('/connexion', req.url);
    url.searchParams.set('suivant', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/compte', '/commandes', '/commandes/:path*', '/commande'],
};
