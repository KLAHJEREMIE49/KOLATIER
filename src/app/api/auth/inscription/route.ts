import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionCookie, hashPassword } from '@/lib/auth';

/** POST /api/auth/inscription — création d'un compte client. */
export async function POST(req: Request) {
  const { nom, email, motDePasse } = await req.json();

  // --- Validation serveur (ne jamais faire confiance au client) ---
  if (!nom?.trim() || !email?.trim() || !motDePasse) {
    return NextResponse.json({ erreur: 'Tous les champs sont obligatoires.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ erreur: 'Adresse e-mail invalide.' }, { status: 400 });
  }
  if (String(motDePasse).length < 6) {
    return NextResponse.json({ erreur: 'Le mot de passe doit contenir au moins 6 caractères.' }, { status: 400 });
  }

  const existant = await prisma.utilisateur.findUnique({ where: { email: email.toLowerCase() } });
  if (existant) {
    return NextResponse.json({ erreur: 'Un compte existe déjà avec cette adresse e-mail.' }, { status: 409 });
  }

  const utilisateur = await prisma.utilisateur.create({
    data: {
      nom: nom.trim(),
      email: email.toLowerCase().trim(),
      motDePasse: await hashPassword(motDePasse), // hash bcrypt, jamais en clair
      role: 'CLIENT',
    },
  });

  await createSessionCookie({
    sub: String(utilisateur.id),
    email: utilisateur.email,
    nom: utilisateur.nom,
    role: 'CLIENT',
  });

  return NextResponse.json({ ok: true });
}
