import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { validateCategoryInput } from "../../../lib/category-utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const validation = validateCategoryInput({
    name: body.name,
    description: body.description,
  });

  if (!validation.ok) {
    return NextResponse.json({ error: "Geçersiz kategori bilgileri", details: validation.errors }, { status: 400 });
  }

  const name = body.name?.toString().trim();
  const existingCategory = await prisma.category.findUnique({ where: { name } });

  if (existingCategory) {
    return NextResponse.json({ error: "Bu kategori zaten mevcut." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name,
      description: body.description?.toString().trim() || "",
    },
  });

  return NextResponse.json(category, { status: 201 });
}
