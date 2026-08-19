import { findUserById } from "@/lib/db/queries";
import { getSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return findUserById(session.userId) || null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
