import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";
import TransferManager from "../../components/stock/TransferManager";
import { prisma } from "../../lib/prisma";

export default async function TransferPage() {
  const batches = await prisma.productBatch.findMany({
    where: { warehouseName: "Ana Depo" },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell title="🔄 Transfer" subtitle="Ana Depo'dan Bar'a transfer">
      <PageHeader title="🔄 Transfer" subtitle="Ana Depo'dan Bar'a transfer" />
      <TransferManager batches={batches} />
    </AppShell>
  );
}
