import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";
import StockMovementManager from "../../components/stock/StockMovementManager";
import { prisma } from "../../lib/prisma";

export default async function StockMovementsPage() {
  const [products, movements] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.stockMovement.findMany({
      include: { product: true, batch: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AppShell title="📦 Stok Hareketleri" subtitle="Depo giriş/çıkış ve transfer kayıtları">
      <PageHeader title="📦 Stok Hareketleri" subtitle="Depo giriş/çıkış ve transfer kayıtları" />
      <StockMovementManager products={products} initialMovements={movements} />
    </AppShell>
  );
}
