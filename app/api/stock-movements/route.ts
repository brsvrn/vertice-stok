import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const movementType = searchParams.get("movementType");
  const warehouse = searchParams.get("warehouse");
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {};

  if (productId) {
    where.productId = Number(productId);
  }

  if (movementType) {
    where.movementType = movementType;
  }

  if (warehouse) {
    where.OR = [{ sourceWarehouse: warehouse }, { targetWarehouse: warehouse }];
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const movements = await prisma.stockMovement.findMany({
    where,
    include: {
      product: true,
      batch: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(movements);
}

export async function POST(request: Request) {
  const body = await request.json();
  const movement = await prisma.stockMovement.create({
    data: {
      movementType: body.movementType,
      productId: Number(body.productId),
      batchId: body.batchId ? Number(body.batchId) : null,
      quantity: Number(body.quantity ?? 0),
      sourceWarehouse: body.sourceWarehouse || "Ana Depo",
      targetWarehouse: body.targetWarehouse || "Bar",
      userName: body.userName || "Sistem",
      description: body.description || "",
    },
    include: {
      product: true,
      batch: true,
    },
  });

  return NextResponse.json(movement, { status: 201 });
}
