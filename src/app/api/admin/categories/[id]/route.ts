import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

/** PUT /api/admin/categories/[id] — renommage. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const { nom } = await req.json();
  if (!nom?.trim()) return NextResponse.json({ erreur: 'Le nom est obligatoire.' }, { status: 400 });

  await prisma.categorie.update({
    where: { id: Number(params.id) },
    data: { nom: nom.trim(), slug: slugify(nom) },
  });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/categories/[id] — refusé si la catégorie contient des produits. */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const id = Number(params.id);
  const nb = await prisma.produit.count({ where: { categorieId: id } });
  if (nb > 0) {
    return NextResponse.json(
      { erreur: `Impossible : ${nb} produit(s) utilisent cette catégorie.` },
      { status: 409 }
    );
  }

  await prisma.categorie.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
