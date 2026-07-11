"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
};

type Batch = {
  id: number;
  batchNumber: string;
  warehouseName: string;
};

type Movement = {
  id: number;
  movementType: string;
  quantity: number;
  sourceWarehouse: string;
  targetWarehouse: string;
  userName: string;
  description: string | null;
  createdAt: Date | string;
  product: { id: number; name: string };
  batch: { batchNumber: string } | null;
};

type StockMovementManagerProps = {
  products: Product[];
  initialMovements: Movement[];
};

const movementTypes = ["INBOUND", "OUTBOUND", "TRANSFER", "WASTE", "COUNT_ADJUSTMENT"];
const movementLabels: Record<string, string> = {
  INBOUND: "Giriş",
  OUTBOUND: "Çıkış",
  TRANSFER: "Transfer",
  WASTE: "Atık",
  COUNT_ADJUSTMENT: "Sayım Düzeltmesi",
};

export default function StockMovementManager({ products, initialMovements }: StockMovementManagerProps) {
  const [movements, setMovements] = useState(initialMovements);
  const [filters, setFilters] = useState({ date: "", productId: "", movementType: "", warehouse: "" });

  const visibleMovements = useMemo(() => {
    return movements.filter((movement) => {
      const movementDate = new Date(movement.createdAt);
      const matchesDate = filters.date ? movementDate.toISOString().slice(0, 10) === filters.date : true;
      const matchesProduct = filters.productId ? String(movement.product.id) === filters.productId : true;
      const matchesType = filters.movementType ? movement.movementType === filters.movementType : true;
      const matchesWarehouse = filters.warehouse ? movement.sourceWarehouse === filters.warehouse || movement.targetWarehouse === filters.warehouse : true;
      return matchesDate && matchesProduct && matchesType && matchesWarehouse;
    });
  }, [filters, movements]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <label style={labelStyle}>
            <span>Tarih</span>
            <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            <span>Ürün</span>
            <select value={filters.productId} onChange={(event) => setFilters((current) => ({ ...current, productId: event.target.value }))} style={inputStyle}>
              <option value="">Tümü</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            <span>Hareket Tipi</span>
            <select value={filters.movementType} onChange={(event) => setFilters((current) => ({ ...current, movementType: event.target.value }))} style={inputStyle}>
              <option value="">Tümü</option>
              {movementTypes.map((type) => (
                <option key={type} value={type}>{movementLabels[type]}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            <span>Depo</span>
            <select value={filters.warehouse} onChange={(event) => setFilters((current) => ({ ...current, warehouse: event.target.value }))} style={inputStyle}>
              <option value="">Tümü</option>
              <option value="Ana Depo">Ana Depo</option>
              <option value="Bar">Bar</option>
            </select>
          </label>
        </div>
      </section>

      <section style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 860, borderCollapse: "collapse" }}>
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <th style={thStyle}>Tarih</th>
                <th style={thStyle}>Ürün</th>
                <th style={thStyle}>Parti</th>
                <th style={thStyle}>Hareket</th>
                <th style={thStyle}>Miktar</th>
                <th style={thStyle}>Kaynak</th>
                <th style={thStyle}>Hedef</th>
                <th style={thStyle}>Kullanıcı</th>
              </tr>
            </thead>
            <tbody>
              {visibleMovements.map((movement) => (
                <tr key={movement.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={tdStyle}>{new Date(movement.createdAt).toLocaleString("tr-TR")}</td>
                  <td style={tdStyle}>{movement.product.name}</td>
                  <td style={tdStyle}>{movement.batch?.batchNumber || "-"}</td>
                  <td style={tdStyle}>{movementLabels[movement.movementType] || movement.movementType}</td>
                  <td style={tdStyle}>{movement.quantity}</td>
                  <td style={tdStyle}>{movement.sourceWarehouse}</td>
                  <td style={tdStyle}>{movement.targetWarehouse}</td>
                  <td style={tdStyle}>{movement.userName}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

const thStyle: React.CSSProperties = {
  padding: "14px 12px",
  textAlign: "left",
  fontSize: 12,
  color: "#64748B",
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 12px",
  verticalAlign: "top",
};
