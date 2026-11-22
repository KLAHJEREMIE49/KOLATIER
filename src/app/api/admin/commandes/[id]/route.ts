import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const STATUTS_VALIDES = ['EN_ATTENTE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'] as const;

/**
 * PATCH /api/admin/commandes/[id] — changement de statut.
 * Annuler une commande remet les articles en stock (dans une transaction),
 * et seulement si ce n'était pas déjà annulé (pas de double restitution).
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const id = Number(params.id);
  const { statut } = await req.json();

  if (!STATUTS_VALIDES.includes(statut)) {
    return NextResponse.json({ erreur: 'Statut invalide.' }, { status: 400 });
  }

  const commande = await prisma.commande.findUnique({ where: { id }, include: { lignes: true } });
  if (!commande) return NextResponse.json({ erreur: 'Commande introuvable.' }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    if (statut === 'ANNULEE' && commande.statut !== 'ANNULEE') {
      for (const ligne of commande.lignes) {
        await tx.produit.update({
          where: { id: ligne.produitId },
          data: { stock: { increment: ligne.quantite } },
        });
      }
    }
    await tx.commande.update({ where: { id }, data: { statut } });
  });

  return NextResponse.json({ ok: true });
}
