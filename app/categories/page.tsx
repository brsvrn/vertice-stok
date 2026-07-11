import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";
import CategoryManager from "../../components/categories/CategoryManager";
import { prisma } from "../../lib/prisma";
import { ensureDefaultCategories } from "../../lib/category-utils";

export default async function CategoriesPage() {
  const categories = await ensureDefaultCategories(prisma);
  const normalizedCategories = categories.map((category) => ({
    ...category,
    description: category.description ?? "",
  }));

  return (
    <AppShell title="📂 Kategoriler" subtitle={`${normalizedCategories.length} kategori mevcut`}>
      <PageHeader title="📂 Kategoriler" subtitle={`${normalizedCategories.length} kategori mevcut`} />

      <CategoryManager initialCategories={normalizedCategories} />
    </AppShell>
  );
}
