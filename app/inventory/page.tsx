import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";
import InventoryManager from "../../components/inventory/InventoryManager";
import { prisma } from "../../lib/prisma";

export default async function InventoryPage() {
  const [products, counts] = await Promise.all([
    prisma.product.findMany({
      include: { batches: true },
      orderBy: { name: "asc" },
    }),
    prisma.inventoryCount.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AppShell title="📋 Sayım" subtitle="Depo bazlı envanter sayımı ve raporları">
      <PageHeader title="📋 Sayım" subtitle="Depo bazlı envanter sayımı ve raporları" />
      <InventoryManager products={products} initialCounts={counts} />
    </AppShell>
  );
}
