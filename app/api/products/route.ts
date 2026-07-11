import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { generateQrCode, validateProductInput } from "../../../lib/product-utils";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      batches: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const normalizedCategoryId = Number(body.categoryId);
  const validation = validateProductInput({
    name: body.name,
    categoryId: Number.isNaN(normalizedCategoryId) ? null : normalizedCategoryId,
    brand: body.brand,
    unit: body.unit,
    criticalStock: body.criticalStock,
    status: body.status,
  });

  if (!validation.ok) {
    return NextResponse.json({ error: "Geçersiz ürün bilgileri", details: validation.errors }, { status: 400 });
  }

  const normalizedBatchNumber = body.batchNumber?.toString().trim();
  const normalizedQrCode = generateQrCode(body.name?.toString().trim() || "PRODUCT");

  const category = await prisma.category.findUnique({ where: { id: normalizedCategoryId } });

  if (!category) {
    return NextResponse.json({ error: "Seçilen kategori bulunamadı." }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { qrCode: normalizedQrCode } });

  if (existingProduct) {
    return NextResponse.json({ error: "QR kod zaten mevcut." }, { status: 409 });
  }

  try {
    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: body.name?.toString().trim(),
          categoryId: normalizedCategoryId,
          brand: body.brand?.toString().trim() || "",
          unit: body.unit?.toString().trim() || "Adet",
          criticalStock: body.criticalStock ?? 0,
          status: body.status || "ACTIVE",
          qrCode: normalizedQrCode,
        },
      });

      await tx.productBatch.create({
        data: {
          productId: createdProduct.id,
          batchNumber: normalizedBatchNumber,
          expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
          quantity: Number(body.quantity ?? 0),
          warehouseName: body.warehouseName?.toString().trim() || "Ana Depo",
        },
      });

      await tx.stockMovement.create({
        data: {
          movementType: "STOCK_IN",
          productId: createdProduct.id,
          quantity: Number(body.quantity ?? 0),
          sourceWarehouse: body.warehouseName?.toString().trim() || "Ana Depo",
          targetWarehouse: body.warehouseName?.toString().trim() || "Ana Depo",
          userName: "Sistem",
          description: "Ürün oluşturma girişi",
        },
      });

      return tx.product.findUniqueOrThrow({
        where: { id: createdProduct.id },
        include: {
          category: true,
          batches: true,
        },
      });
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Bu parti numarası zaten mevcut." }, { status: 409 });
    }

    throw error;
  }
}
