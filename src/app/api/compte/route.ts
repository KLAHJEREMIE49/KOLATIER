import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, requireUser, verifyPassword } from '@/lib/auth';

/** PUT /api/compte — modification du profil (nom, e-mail, mot de passe). */
export async function PUT(req: Request) {
  const garde = await requireUser();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const { nom, email, motDePasseActuel, nouveauMotDePasse } = await req.json();
  const id = Number(garde.session.sub);

  if (!nom?.trim() || !email?.trim()) {
    return NextResponse.json({ erreur: 'Nom et e-mail sont obligatoires.' }, { status: 400 });
  }

  const emailNormalise = String(email).toLowerCase().trim();
  const autre = await prisma.utilisateur.findUnique({ where: { email: emailNormalise } });
  if (autre && autre.id !== id) {
    return NextResponse.json({ erreur: 'Cette adresse e-mail est déjà utilisée.' }, { status: 409 });
  }

  const data: { nom: string; email: string; motDePasse?: string } = {
    nom: nom.trim(),
    email: emailNormalise,
  };

  // Changement de mot de passe : exige l'ancien mot de passe
  if (nouveauMotDePasse) {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { id } });
    if (!utilisateur) return NextResponse.json({ erreur: 'Compte introuvable.' }, { status: 404 });

    const ok = await verifyPassword(motDePasseActuel ?? '', utilisateur.motDePasse);
    if (!ok) return NextResponse.json({ erreur: 'Mot de passe actuel incorrect.' }, { status: 400 });
    if (String(nouveauMotDePasse).length < 6) {
      return NextResponse.json({ erreur: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' }, { status: 400 });
    }
    data.motDePasse = await hashPassword(nouveauMotDePasse);
  }

  await prisma.utilisateur.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
