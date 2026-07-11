"use client";

import { useState } from "react";
import { formatInventoryVariance } from "../../lib/inventory-utils";

type Product = {
  id: number;
  name: string;
  unit: string;
  batches?: Array<{ quantity: number; warehouseName: string }>;
};

type InventoryItem = {
  id: number;
  expectedQuantity: number;
  countedQuantity: number | null;
  variance: number | null;
  product: Product;
};

type InventoryCount = {
  id: number;
  title: string;
  warehouseName: string;
  status: string;
  notes: string | null;
  createdAt: Date | string;
  items: InventoryItem[];
};

type InventoryManagerProps = {
  products: Product[];
  initialCounts: InventoryCount[];
};

export default function InventoryManager({ products, initialCounts }: InventoryManagerProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [title, setTitle] = useState("Yeni Sayım");
  const [warehouseName, setWarehouseName] = useState("Ana Depo");
  const [notes, setNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const expectedQuantityFor = (product: Product, warehouse: string) =>
    (product.batches ?? [])
      .filter((batch) => batch.warehouseName === warehouse)
      .reduce((sum, batch) => sum + batch.quantity, 0);

  const createCount = async () => {
    setIsCreating(true);
    const response = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        warehouseName,
        notes,
        items: products.map((product) => ({
          productId: product.id,
          expectedQuantity: expectedQuantityFor(product, warehouseName),
        })),
      }),
    });

    const count = await response.json();
    setCounts((current) => [count, ...current]);
    setIsCreating(false);
  };

  const updateCountedQuantity = async (countId: number, itemId: number, expectedQuantity: number, value: string) => {
    const parsed = value === "" ? null : Number(value);
    const variance = parsed == null ? null : parsed - expectedQuantity;

    setCounts((current) =>
      current.map((entry) =>
        entry.id === countId
          ? {
              ...entry,
              items: entry.items.map((item) => (item.id === itemId ? { ...item, countedQuantity: parsed, variance } : item)),
            }
          : entry,
      ),
    );

    await fetch(`/api/inventory/${countId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, countedQuantity: parsed, expectedQuantity }),
    });
  };

  const completeCount = async (countId: number) => {
    const response = await fetch(`/api/inventory/${countId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete", userName: "Yönetici" }),
    });
    if (response.ok) {
      setCounts((current) => current.map((entry) => (entry.id === countId ? { ...entry, status: "COMPLETED" } : entry)));
    }
  };

  const downloadReport = (count: InventoryCount, format: "pdf" | "excel") => {
    const rows = count.items
      .map((item) => `${item.product.name};${item.expectedQuantity};${item.countedQuantity ?? ""};${item.variance ?? ""}`)
      .join("\n");

    const content = format === "excel"
      ? `product;expected;counted;variance\n${rows}`
      : `%PDF-1.4\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n4 0 obj<< /Length 44 >>stream\nBT /F1 12 Tf 72 72 Td (${count.title}) Tj ET\nendstream\nendobj\n5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000119 00000 n \n0000000206 00000 n \n0000000300 00000 n \ntrailer<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`;

    const blob = new Blob([content], { type: format === "excel" ? "text/csv;charset=utf-8;" : "application/pdf;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${count.title}.${format === "excel" ? "csv" : "pdf"}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <label style={labelStyle}>
            <span>Sayım Başlığı</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            <span>Depo</span>
            <select value={warehouseName} onChange={(event) => setWarehouseName(event.target.value)} style={inputStyle}>
              <option value="Ana Depo">Ana Depo</option>
              <option value="Bar">Bar</option>
            </select>
          </label>
          <label style={labelStyle}>
            <span>Not</span>
            <input value={notes} onChange={(event) => setNotes(event.target.value)} style={inputStyle} />
          </label>
        </div>
        <button onClick={createCount} disabled={isCreating} style={buttonStyle}>
          {isCreating ? "Oluşturuluyor..." : "Yeni Sayım Oluştur"}
        </button>
      </section>

      <section style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <div style={{ display: "grid", gap: 12 }}>
          {counts.map((count) => (
            <div key={count.id} style={{ border: "1px solid #E2E8F0", borderRadius: 16, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{count.title}</div>
                  <div style={{ color: "#64748B", fontSize: 13 }}>{count.warehouseName} • {count.status}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => downloadReport(count, "excel")} style={secondaryButtonStyle}>Excel</button>
                  <button onClick={() => downloadReport(count, "pdf")} style={secondaryButtonStyle}>PDF</button>
                  {count.status !== "COMPLETED" ? <button onClick={() => completeCount(count.id)} style={buttonStyle}>Tamamla</button> : null}
                </div>
              </div>
              <div style={{ overflowX: "auto", marginTop: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      <th style={thStyle}>Ürün</th>
                      <th style={thStyle}>Beklenen</th>
                      <th style={thStyle}>Sayım</th>
                      <th style={thStyle}>Fark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {count.items.map((item) => (
                      <tr key={item.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                        <td style={tdStyle}>{item.product.name}</td>
                        <td style={tdStyle}>{item.expectedQuantity}</td>
                        <td style={tdStyle}>
                          <input
                            type="number"
                            value={item.countedQuantity ?? ""}
                            onChange={(event) => updateCountedQuantity(count.id, item.id, item.expectedQuantity, event.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>{item.variance != null ? formatInventoryVariance(item.variance) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
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
  marginTop: 10,
  padding: "12px 16px",
  border: "none",
  borderRadius: 10,
  background: "#2563EB",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  background: "#fff",
  color: "#0F172A",
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  color: "#64748B",
  fontSize: 12,
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  verticalAlign: "top",
};
