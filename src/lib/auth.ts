import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

/** Nom du cookie de session (httpOnly, sameSite=lax). */
export const COOKIE_NAME = 'session';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-a-remplacer-en-production-32-caracteres'
);

export type SessionPayload = {
  sub: string; // id utilisateur
  email: string;
  nom: string;
  role: 'CLIENT' | 'ADMIN';
};

/* -------------------------------------------------------------------------- */
/*  Mots de passe                                                             */
/* -------------------------------------------------------------------------- */

/** Hash bcrypt (10 rounds) — aucun mot de passe n'est stocké en clair. */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* -------------------------------------------------------------------------- */
/*  JWT                                                                        */
/* -------------------------------------------------------------------------- */

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Helpers serveur                                                           */
/* -------------------------------------------------------------------------- */

/** Écrit le cookie de session après inscription / connexion. */
export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

/**
 * Retourne l'utilisateur courant (vérifié en base : un compte bloqué ou
 * supprimé perd immédiatement sa session côté serveur).
 */
export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const user = await prisma.utilisateur.findUnique({
    where: { id: Number(session.sub) },
    select: { id: true, nom: true, email: true, role: true, bloque: true, creeLe: true },
  });

  if (!user || user.bloque) return null;
  return session;
}

/** Garde pour les routes API / pages admin. */
export async function requireAdmin() {
  const session = await getCurrentUser();
  if (!session) return { error: 'Non authentifié', status: 401 as const };
  if (session.role !== 'ADMIN') return { error: 'Accès réservé aux administrateurs', status: 403 as const };
  return { session };
}

export async function requireUser() {
  const session = await getCurrentUser();
  if (!session) return { error: 'Vous devez être connecté.', status: 401 as const };
  return { session };
}
