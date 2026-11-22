import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  let contenu: unknown;
  try {
    contenu = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'Le formulaire est invalide.' }, { status: 400 });
  }

  if (!contenu || typeof contenu !== 'object') {
    return NextResponse.json({ erreur: 'Le formulaire est invalide.' }, { status: 400 });
  }
  const donnees = contenu as Record<string, unknown>;
  const nom = typeof donnees.nom === 'string' ? donnees.nom.trim() : '';
  const email = typeof donnees.email === 'string' ? donnees.email.trim().toLowerCase() : '';
  const sujet = typeof donnees.sujet === 'string' ? donnees.sujet.trim() : '';
  const message = typeof donnees.message === 'string' ? donnees.message.trim() : '';

  if (nom.length < 2 || nom.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      sujet.length < 2 || sujet.length > 160 || message.length < 10 || message.length > 4000) {
    return NextResponse.json({ erreur: 'Vérifiez les champs : nom, adresse e-mail, sujet et message.' }, { status: 400 });
  }

  await prisma.messageContact.create({ data: { nom, email, sujet, message } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
