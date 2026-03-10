import { NextResponse } from "next/server";
import { createProduct, getActiveProducts, getProductsForAdmin } from "@/lib/db/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { productInputSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "1";

  if (admin) {
    const allowed = await isAdminAuthenticated();
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getProductsForAdmin();
    return NextResponse.json({ products });
  }

  const products = await getActiveProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const product = await createProduct(parsed.data);
  return NextResponse.json({ product }, { status: 201 });
}
