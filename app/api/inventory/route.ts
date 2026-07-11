import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const counts = await prisma.inventoryCount.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(counts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const count = await prisma.inventoryCount.create({
    data: {
      title: body.title || "Yeni Sayım",
      warehouseName: body.warehouseName || "Ana Depo",
      status: "DRAFT",
      notes: body.notes || "",
      items: {
        create: body.items.map((item: { productId: number; expectedQuantity: number }) => ({
          productId: Number(item.productId),
          expectedQuantity: Number(item.expectedQuantity ?? 0),
        })),
      },
    },
    include: {
      items: { include: { product: true } },
    },
  });

  return NextResponse.json(count, { status: 201 });
}
