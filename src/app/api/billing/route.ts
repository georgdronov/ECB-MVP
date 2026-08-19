import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getWorkspaceSummary, updatePlan } from "@/lib/db/queries";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ billing: getWorkspaceSummary(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { plan?: string } | null;
  if (body?.plan !== "free" && body?.plan !== "pro") return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  return NextResponse.json({ subscription: updatePlan(user.id, body.plan) });
}
