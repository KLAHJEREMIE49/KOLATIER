import { PrismaClient } from '@prisma/client';

// Une URL collée depuis un tableau de bord contient souvent des guillemets,
// le préfixe "DATABASE_URL=" ou une commande "psql '...'". Prisma rejette alors
// la valeur : on en extrait l'URL postgres:// réelle.
function nettoyerUrl(valeur: string | undefined): string | undefined {
  if (!valeur) return undefined;
  const trouvee = valeur.match(/postgres(?:ql)?:\/\/[^\s'"`]+/);
  return trouvee?.[0];
}

function resoudreUrlBase(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
  ];
  for (const candidate of candidates) {
    const url = nettoyerUrl(candidate);
    if (url) return url;
  }
  return undefined;
}

const datasourceUrl = resoudreUrlBase();

if (!datasourceUrl) {
  console.error(
    '[prisma] Aucune URL PostgreSQL valide trouvée. DATABASE_URL doit commencer par postgresql:// ou postgres://',
  );
}

// Singleton Prisma : évite de multiplier les connexions en développement
// (le hot-reload de Next.js ré-exécute les modules).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
