import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Messages de contact' };

export default async function AdminMessagesPage() {
  const messages = await prisma.messageContact.findMany({ orderBy: { creeLe: 'desc' } });

  return (
    <div>
      <h1 className="titre text-3xl font-bold">Messages de contact</h1>
      <p className="mt-1 text-sm text-slate-600">{messages.length} message(s) enregistré(s).</p>
      <div className="mt-5 space-y-4">
        {messages.length === 0 && <p className="carte p-6 text-sm text-slate-500">Aucun message pour le moment.</p>}
        {messages.map((m) => (
          <article key={m.id} className="carte p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-bold text-terre">{m.sujet}</h2>
              <time className="text-xs text-slate-500">{formatDate(m.creeLe)}</time>
            </div>
            <p className="mt-1 text-sm text-slate-600">{m.nom} · <a className="text-marque-700 hover:underline" href={`mailto:${m.email}`}>{m.email}</a></p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{m.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
