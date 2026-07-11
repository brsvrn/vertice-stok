import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const productId = Number(body.productId);

  if (!productId) {
    return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  const batchNumber = body.batchNumber?.toString().trim();

  if (!batchNumber) {
    return NextResponse.json({ error: "Parti numarası zorunlu." }, { status: 400 });
  }

  const existingBatch = await prisma.productBatch.findFirst({
    where: {
      productId,
      batchNumber,
    },
  });

  if (existingBatch) {
    return NextResponse.json({ error: "Bu parti numarası zaten mevcut." }, { status: 409 });
  }

  const batch = await prisma.productBatch.create({
    data: {
      productId,
      batchNumber,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      quantity: Number(body.quantity ?? 0),
      warehouseName: body.warehouseName?.toString().trim() || "Ana Depo",
    },
  });

  return NextResponse.json(batch, { status: 201 });
}
