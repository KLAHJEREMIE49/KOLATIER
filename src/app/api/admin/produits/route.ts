import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

/** POST /api/admin/produits — création d'un produit. */
export async function POST(req: Request) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const { nom, description, prix, stock, image, categorieId, actif, origine, artisan, matiere } = await req.json();

  if (!nom?.trim() || !description?.trim() || !categorieId) {
    return NextResponse.json({ erreur: 'Nom, description et catégorie sont obligatoires.' }, { status: 400 });
  }
  const prixNum = Number(prix);
  if (Number.isNaN(prixNum) || prix === '' || prix === null || prixNum < 0 || !Number.isInteger(prixNum)) {
    return NextResponse.json({ erreur: 'Prix invalide.' }, { status: 400 });
  }

  // Slug unique : on suffixe si nécessaire
  let slug = slugify(nom);
  let suffixe = 1;
  while (await prisma.produit.findUnique({ where: { slug } })) {
    slug = `${slugify(nom)}-${++suffixe}`;
  }

  const produit = await prisma.produit.create({
    data: {
      nom: nom.trim(),
      slug,
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

  return NextResponse.json({ ok: true, id: produit.id });
}
