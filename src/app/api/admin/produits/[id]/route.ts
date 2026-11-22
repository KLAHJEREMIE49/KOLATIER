import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

/** PUT /api/admin/produits/[id] — mise à jour (y compris le stock). */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const id = Number(params.id);
  const { nom, description, prix, stock, image, categorieId, actif, origine, artisan, matiere } = await req.json();

  if (!nom?.trim() || !description?.trim() || !categorieId) {
    return NextResponse.json({ erreur: 'Nom, description et catégorie sont obligatoires.' }, { status: 400 });
  }
  const prixNum = Number(prix);
  if (Number.isNaN(prixNum) || prix === '' || prix === null || prixNum < 0 || !Number.isInteger(prixNum)) {
    return NextResponse.json({ erreur: 'Prix invalide.' }, { status: 400 });
  }

  await prisma.produit.update({
    where: { id },
    data: {
      nom: nom.trim(),
      description: description.trim(),
      prix: Number(prixNum.toFixed(2)),
      stock: Math.max(0, Math.floor(Number(stock) || 0)),
      image: image?.trim() || null,
      origine: typeof origine === 'string' ? origine.trim() || null : null,
      artisan: typeof artisan === 'string' ? artisan.trim() || null : null,
      matiere: typeof matiere === 'string' ? matiere.trim() || null : null,
      actif: actif !== false,
      categorieId: Number(categorieId),
    },
  });

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/admin/produits/[id]
 *
 * Un produit déjà commandé ne peut pas être supprimé (intégrité de l'historique) :
 * on le désactive à la place, il disparaît du catalogue.
 */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const id = Number(params.id);
  const lignes = await prisma.ligneCommande.count({ where: { produitId: id } });

  if (lignes > 0) {
    await prisma.produit.update({ where: { id }, data: { actif: false } });
    return NextResponse.json({
      ok: true,
      archive: true,
      message: 'Produit présent dans des commandes : il a été désactivé au lieu d’être supprimé.',
    });
  }

  await prisma.produit.delete({ where: { id } });
  return NextResponse.json({ ok: true, archive: false });
}
