import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { findUserByEmail, normalizeEmail } from "@/lib/db/queries";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const user = findUserByEmail(normalizeEmail(body?.email || ""));

  if (!user || !(body?.password && await compare(body.password, user.password_hash))) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  await setSession(user.id);
  return NextResponse.json({ ok: true });
}
