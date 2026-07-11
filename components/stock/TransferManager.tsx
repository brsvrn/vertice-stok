"use client";

import { useMemo, useState } from "react";

type Batch = {
  id: number;
  batchNumber: string;
  quantity: number;
  product: { name: string };
};

type TransferManagerProps = {
  batches: Batch[];
};

export default function TransferManager({ batches }: TransferManagerProps) {
  const [selectedBatchId, setSelectedBatchId] = useState(String(batches[0]?.id ?? ""));
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBatch = useMemo(() => batches.find((batch) => String(batch.id) === selectedBatchId), [batches, selectedBatchId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedBatch) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: Number(selectedBatchId),
          quantity: Number(quantity),
          sourceWarehouse: "Ana Depo",
          targetWarehouse: "Bar",
          userName: "Yönetici",
          description: "Ana Depo'dan Bar'a transfer",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Transfer başarısız oldu");
      setStatus(`Transfer başarıyla kaydedildi. Kalan miktar: ${data.remainingQuantity}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Transfer başarısız oldu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 480 }}>
          <label style={labelStyle}>
            <span>Parti</span>
            <select value={selectedBatchId} onChange={(event) => setSelectedBatchId(event.target.value)} style={inputStyle}>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.product.name} / {batch.batchNumber} (Stok: {batch.quantity})
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span>Miktar</span>
            <input type="number" min="1" max={selectedBatch?.quantity ?? 1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} style={inputStyle} />
          </label>

          <div style={{ color: "#64748B", fontSize: 14 }}>
            Seçili parti stok: <strong>{selectedBatch?.quantity ?? 0}</strong>
          </div>

          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? "İşleniyor..." : "Transfer Et"}
          </button>
        </form>
      </section>

      {status ? (
        <section style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
          <div style={{ color: status.includes("başarı") ? "#0F766E" : "#B91C1C" }}>{status}</div>
        </section>
      ) : null}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontWeight: 600,
  color: "#334155",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 16px",
  border: "none",
  borderRadius: 10,
  background: "#2563EB",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};
