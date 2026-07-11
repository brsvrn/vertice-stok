import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const count = await prisma.inventoryCount.findUnique({
    where: { id: Number(id) },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!count) {
    return NextResponse.json({ error: "Sayım bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(count);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (body.action === "complete") {
    const count = await prisma.inventoryCount.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });

    if (!count) {
      return NextResponse.json({ error: "Sayım bulunamadı" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of count.items) {
        const variance = (item.countedQuantity ?? item.expectedQuantity) - item.expectedQuantity;
        const batch = await tx.productBatch.findFirst({
          where: {
            productId: item.productId,
            warehouseName: count.warehouseName,
          },
        });

        if (batch) {
          await tx.productBatch.update({
            where: { id: batch.id },
            data: { quantity: Math.max(0, (batch.quantity ?? 0) + variance) },
          });
        }

        await tx.stockMovement.create({
          data: {
            movementType: "COUNT_ADJUSTMENT",
            productId: item.productId,
            batchId: batch?.id ?? null,
            quantity: Math.abs(variance),
            sourceWarehouse: count.warehouseName,
            targetWarehouse: count.warehouseName,
            userName: body.userName || "Sistem",
            description: `Sayım farkı: ${variance > 0 ? "+" : ""}${variance}`,
          },
        });
      }

      await tx.inventoryCount.update({
        where: { id: Number(id) },
        data: { status: "COMPLETED" },
      });
    });

    return NextResponse.json({ ok: true });
  }

  const updated = await prisma.inventoryCountItem.update({
    where: { id: Number(body.itemId) },
    data: {
      countedQuantity: body.countedQuantity != null ? Number(body.countedQuantity) : null,
      variance: body.countedQuantity != null ? Number(body.countedQuantity) - Number(body.expectedQuantity) : null,
    },
  });

  return NextResponse.json(updated);
}
