import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "helpy_session";
const sessionLifetime = 60 * 60 * 24 * 7;

function secret() {
  return process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSessionToken(userId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetime;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;

  const [userId, expiresAt, signature] = token.split(".");
  if (!userId || !expiresAt || !signature || Number(expiresAt) < Date.now() / 1000) {
    return null;
  }

  const expected = sign(`${userId}.${expiresAt}`);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return valid ? { userId, expiresAt: Number(expiresAt) } : null;
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionLifetime,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(cookieName)?.value);
}

export { cookieName };
