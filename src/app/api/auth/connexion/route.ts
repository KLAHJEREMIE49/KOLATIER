import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionCookie, verifyPassword } from '@/lib/auth';

/** POST /api/auth/connexion — vérification bcrypt + cookie de session JWT. */
export async function POST(req: Request) {
  const { email, motDePasse } = await req.json();

  if (!email || !motDePasse) {
    return NextResponse.json({ erreur: 'E-mail et mot de passe requis.' }, { status: 400 });
  }

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email: String(email).toLowerCase().trim() },
  });

  // Message volontairement identique (e-mail inconnu / mauvais mot de passe)
  if (!utilisateur || !(await verifyPassword(motDePasse, utilisateur.motDePasse))) {
    return NextResponse.json({ erreur: 'Identifiants incorrects.' }, { status: 401 });
  }

  if (utilisateur.bloque) {
    return NextResponse.json({ erreur: 'Ce compte a été bloqué par un administrateur.' }, { status: 403 });
  }

  await createSessionCookie({
    sub: String(utilisateur.id),
    email: utilisateur.email,
    nom: utilisateur.nom,
    role: utilisateur.role,
  });

  return NextResponse.json({ ok: true, role: utilisateur.role });
}
