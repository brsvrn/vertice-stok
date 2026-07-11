import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";
import ProductManager from "../../components/products/ProductManager";
import { ensureDefaultCategories } from "../../lib/category-utils";
import { prisma } from "../../lib/prisma";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        batches: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    ensureDefaultCategories(prisma),
  ]);

  const normalizedProducts = products.map((product) => ({
    ...product,
    category: { name: product.category.name },
    batches: product.batches.map((batch) => ({
      id: batch.id,
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate ? batch.expiryDate.toISOString() : null,
      quantity: batch.quantity,
      warehouseName: batch.warehouseName,
    })),
  }));

  return (
    <AppShell title="📦 Ürünler" subtitle="Sistemde kayıtlı tüm ürünler">
      <PageHeader title="📦 Ürünler" subtitle="Sistemde kayıtlı tüm ürünler" />

      <ProductManager initialProducts={normalizedProducts} categories={categories} />
    </AppShell>
  );
}
