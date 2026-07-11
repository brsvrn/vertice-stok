import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const batchId = Number(body.batchId);
  const quantity = Number(body.quantity ?? 0);

  if (!batchId || !quantity) {
    return NextResponse.json({ error: "Geçersiz transfer bilgisi." }, { status: 400 });
  }

  const batch = await prisma.productBatch.findUnique({ where: { id: batchId } });

  if (!batch) {
    return NextResponse.json({ error: "Parti bulunamadı." }, { status: 404 });
  }

  if (batch.quantity < quantity) {
    return NextResponse.json({ error: "Transfer miktarı mevcut stoktan fazla olamaz." }, { status: 400 });
  }

  const updatedBatch = await prisma.$transaction(async (tx) => {
    const sourceBatch = await tx.productBatch.update({
      where: { id: batchId },
      data: { quantity: batch.quantity - quantity },
    });

    const targetBatch = await tx.productBatch.findFirst({
      where: {
        productId: batch.productId,
        warehouseName: "Bar",
      },
    });

    if (targetBatch) {
      await tx.productBatch.update({
        where: { id: targetBatch.id },
        data: { quantity: targetBatch.quantity + quantity },
      });
    } else {
      await tx.productBatch.create({
        data: {
          productId: batch.productId,
          batchNumber: `${batch.batchNumber}-BAR`,
          quantity,
          warehouseName: "Bar",
          expiryDate: batch.expiryDate,
        },
      });
    }

    await tx.stockMovement.create({
      data: {
        movementType: "TRANSFER",
        productId: batch.productId,
        batchId: batch.id,
        quantity,
        sourceWarehouse: "Ana Depo",
        targetWarehouse: "Bar",
        userName: body.userName || "Sistem",
        description: body.description || "Transfer",
      },
    });

    return sourceBatch;
  });

  return NextResponse.json({ ok: true, batch: updatedBatch });
}
