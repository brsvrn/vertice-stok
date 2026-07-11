import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batchId = Number(id);
  const body = await request.json();

  if (!batchId) {
    return NextResponse.json({ error: "Geçersiz parti ID" }, { status: 400 });
  }

  const existingBatch = await prisma.productBatch.findUnique({ where: { id: batchId } });

  if (!existingBatch) {
    return NextResponse.json({ error: "Parti bulunamadı" }, { status: 404 });
  }

  const updatedBatch = await prisma.productBatch.update({
    where: { id: batchId },
    data: {
      batchNumber: body.batchNumber?.toString().trim() || existingBatch.batchNumber,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : existingBatch.expiryDate,
      quantity: body.quantity ?? existingBatch.quantity,
      warehouseName: body.warehouseName?.toString().trim() || existingBatch.warehouseName,
    },
  });

  return NextResponse.json(updatedBatch);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batchId = Number(id);

  if (!batchId) {
    return NextResponse.json({ error: "Geçersiz parti ID" }, { status: 400 });
  }

  const existingBatch = await prisma.productBatch.findUnique({ where: { id: batchId } });

  if (!existingBatch) {
    return NextResponse.json({ error: "Parti bulunamadı" }, { status: 404 });
  }

  await prisma.productBatch.delete({ where: { id: batchId } });

  return NextResponse.json({ ok: true });
}
