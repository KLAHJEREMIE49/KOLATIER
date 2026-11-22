import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

/** PATCH /api/admin/utilisateurs/[id] — bloquer / débloquer un compte. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const garde = await requireAdmin();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const id = Number(params.id);
  const { bloque } = await req.json();

  // Un administrateur ne peut ni se bloquer lui-même ni bloquer un autre admin.
  if (id === Number(garde.session.sub)) {
    return NextResponse.json({ erreur: 'Vous ne pouvez pas bloquer votre propre compte.' }, { status: 400 });
  }

  const cible = await prisma.utilisateur.findUnique({ where: { id } });
  if (!cible) return NextResponse.json({ erreur: 'Utilisateur introuvable.' }, { status: 404 });
  if (cible.role === 'ADMIN') {
    return NextResponse.json({ erreur: 'Un administrateur ne peut pas être bloqué.' }, { status: 400 });
  }

  await prisma.utilisateur.update({ where: { id }, data: { bloque: Boolean(bloque) } });
  return NextResponse.json({ ok: true });
}
