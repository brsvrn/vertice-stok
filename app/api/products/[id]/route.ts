import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);

  if (!productId) {
    return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      batches: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  const body = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

  if (!existingProduct) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: body.name?.toString().trim() || existingProduct.name,
      brand: body.brand?.toString().trim() || existingProduct.brand,
      unit: body.unit?.toString().trim() || existingProduct.unit,
      criticalStock: body.criticalStock ?? existingProduct.criticalStock,
      status: body.status || existingProduct.status,
      categoryId: body.categoryId ? Number(body.categoryId) : existingProduct.categoryId,
    },
    include: {
      category: true,
      batches: true,
    },
  });

  return NextResponse.json(updatedProduct);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);

  if (!productId) {
    return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

  if (!existingProduct) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  await prisma.product.update({
    where: { id: productId },
    data: { status: "INACTIVE" },
  });

  return NextResponse.json({ ok: true });
}
