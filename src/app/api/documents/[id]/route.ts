import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { deleteDocument } from "@/lib/db/queries";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  if (!deleteDocument(user.id, id)) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
