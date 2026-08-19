import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { completeOnboarding } from "@/lib/db/queries";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { step?: string } | null;
  if (body?.step !== "embed_copied") return NextResponse.json({ error: "Invalid onboarding step." }, { status: 400 });
  completeOnboarding(user.id, "embed_copied");
  return NextResponse.json({ ok: true });
}
