import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

/** POST /api/admin/categories — création d'une catégorie. */
export async function POST(req: Request) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const { nom } = await req.json();
  if (!nom?.trim()) return NextResponse.json({ erreur: 'Le nom est obligatoire.' }, { status: 400 });

  const slug = slugify(nom);
  const existante = await prisma.categorie.findFirst({
    where: { OR: [{ nom: nom.trim() }, { slug }] },
  });
  if (existante) return NextResponse.json({ erreur: 'Cette catégorie existe déjà.' }, { status: 409 });

  const categorie = await prisma.categorie.create({ data: { nom: nom.trim(), slug } });
  return NextResponse.json({ ok: true, id: categorie.id });
}
