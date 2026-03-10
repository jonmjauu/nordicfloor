import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/db/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { productInputSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const product = await updateProduct(Number(id), parsed.data);
  return NextResponse.json({ product });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteProduct(Number(id));
  return NextResponse.json({ ok: true });
}
