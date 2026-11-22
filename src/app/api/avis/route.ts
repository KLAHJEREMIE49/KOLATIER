import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

/** Publication d'un avis client (1 à 5 étoiles) sur un produit reçu. */
export async function POST(req: Request) {
  const garde = await requireUser();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  let contenu: unknown;
  try {
    contenu = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'L’avis est invalide.' }, { status: 400 });
  }
  if (!contenu || typeof contenu !== 'object') {
    return NextResponse.json({ erreur: 'L’avis est invalide.' }, { status: 400 });
  }

  const donnees = contenu as Record<string, unknown>;
  const produitId = Number(donnees.produitId);
  const note = Number(donnees.note);
  const commentaire = typeof donnees.commentaire === 'string' ? donnees.commentaire.trim() : '';
  const titreBrut = typeof donnees.titre === 'string' ? donnees.titre.trim() : '';
  const titre = titreBrut.length > 0 ? titreBrut.slice(0, 90) : null;

  if (
    !Number.isInteger(produitId) ||
    produitId < 1 ||
    !Number.isInteger(note) ||
    note < 1 ||
    note > 5 ||
    commentaire.length < 5 ||
    commentaire.length > 1000 ||
    (titre !== null && titre.length < 3)
  ) {
    return NextResponse.json(
      { erreur: 'La note doit être comprise entre 1 et 5 et le commentaire entre 5 et 1 000 caractères.' },
      { status: 400 },
    );
  }

  const utilisateurId = Number(garde.session.sub);

  // Seuls les clients ayant reçu ce produit peuvent le noter.
  const achatLivre = await prisma.commande.findFirst({
    where: { utilisateurId, statut: 'LIVREE', lignes: { some: { produitId } } },
    select: { id: true },
  });
  if (!achatLivre) {
    return NextResponse.json(
      { erreur: 'Un avis est possible uniquement après la livraison de ce produit.' },
      { status: 403 },
    );
  }

  await prisma.avis.upsert({
    where: { utilisateurId_produitId: { utilisateurId, produitId } },
    create: { utilisateurId, produitId, note, commentaire, titre, achatVerifie: true },
    update: { note, commentaire, titre, achatVerifie: true },
  });

  return NextResponse.json({ ok: true });
}
