import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/layout/PageHeader";
import ProductForm from "../../../components/products/ProductForm";
import { prisma } from "../../../lib/prisma";
import { ensureDefaultCategories } from "../../../lib/category-utils";

export default async function NewProductPage() {
  const categories = await ensureDefaultCategories(prisma);

  return (
    <AppShell title="➕ Yeni Ürün" subtitle="Ürün bilgilerini ekleyin">
      <PageHeader title="➕ Yeni Ürün" subtitle="Ürün bilgilerini ekleyin" />

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <ProductForm categories={categories} />
      </div>
    </AppShell>
  );
}
