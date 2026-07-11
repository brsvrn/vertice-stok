import AppShell from "../../components/layout/AppShell";
import { prisma } from "../../lib/prisma";

export default async function DashboardPage() {
  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      include: { batches: true },
    }),
    prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  const totalStock = products.reduce((sum, product) => sum + product.batches.reduce((batchSum, batch) => batchSum + batch.quantity, 0), 0);
  const anaDepoStock = products.reduce((sum, product) => sum + product.batches.filter((batch) => batch.warehouseName === "Ana Depo").reduce((batchSum, batch) => batchSum + batch.quantity, 0), 0);
  const barStock = products.reduce((sum, product) => sum + product.batches.filter((batch) => batch.warehouseName === "Bar").reduce((batchSum, batch) => batchSum + batch.quantity, 0), 0);
  const criticalStockCount = products.filter((product) => {
    const currentStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);
    return currentStock <= product.criticalStock;
  }).length;

  const cards = [
    { title: "Toplam Ürün", value: products.length.toString(), color: "#2563EB" },
    { title: "Ana Depo Stok", value: anaDepoStock.toString(), color: "#0F766E" },
    { title: "Bar Stok", value: barStock.toString(), color: "#7C3AED" },
    { title: "Kritik Stok", value: criticalStockCount.toString(), color: "#DC2626" },
    { title: "Bugünkü İşlem", value: movements.length.toString(), color: "#16A34A" },
    { title: "Toplam Stok", value: totalStock.toString(), color: "#EA580C" },
  ];

  return (
    <AppShell title="📊 Dashboard" subtitle="Özet görünüm ve hızlı istatistikler">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ color: "#64748B", marginBottom: 10 }}>{card.title}</div>
            <div style={{ fontSize: 34, fontWeight: "bold", color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
