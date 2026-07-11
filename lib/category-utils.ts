import type { PrismaClient } from "@prisma/client";

export type CategorySeed = {
  name: string;
  description: string;
};

export const DEFAULT_CATEGORY_SEEDS: CategorySeed[] = [
  { name: "İçecek", description: "Meşrubat ve kahve çeşitleri" },
  { name: "Atıştırmalık", description: "Tatlı ve tuzlu atıştırmalıklar" },
];

export type CategoryValidationPayload = {
  name: string;
  description?: string;
};

export function validateCategoryInput(payload: CategoryValidationPayload) {
  const errors: string[] = [];

  if (!payload.name?.trim()) {
    errors.push("Kategori adı zorunlu.");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export async function ensureDefaultCategories(prisma: Pick<PrismaClient, "category">) {
  const existingCategories = await prisma.category.findMany({ take: 20 });

  if (existingCategories.length === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORY_SEEDS,
      skipDuplicates: true,
    });
  }

  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
