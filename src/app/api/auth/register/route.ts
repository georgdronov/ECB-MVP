import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser, findUserByEmail, normalizeEmail } from "@/lib/db/queries";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = normalizeEmail(body?.email || "");
  const password = body?.password || "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const { userId } = createUser(email, await hash(password, 12));
  await setSession(userId);
  return NextResponse.json({ ok: true });
}
