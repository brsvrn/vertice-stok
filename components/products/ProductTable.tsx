"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  brand: string;
  batchNumber: string;
  qrCode: string;
  status: string;
  criticalStock: number;
  unit: string;
  createdAt: string;
  category: {
    name: string;
  };
  warehouseStock?: {
    quantity: number;
  } | null;
};

type ProductTableProps = {
  initialProducts: Product[];
};

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProducts((current) => current.filter((product) => product.id !== id));
    }
  };

  return (
    <div style={{ overflowX: "auto", borderRadius: 12, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
        <thead style={{ background: "#F8FAFC" }}>
          <tr>
            <th style={thStyle}>Ürün</th>
            <th style={thStyle}>Kategori</th>
            <th style={thStyle}>Marka</th>
            <th style={thStyle}>Parti</th>
            <th style={thStyle}>QR</th>
            <th style={thStyle}>Kritik</th>
            <th style={thStyle}>Stok</th>
            <th style={thStyle}>Durum</th>
            <th style={thStyle}>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ padding: 20, textAlign: "center", color: "#64748B" }}>
                Henüz ürün eklenmedi.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                <td style={tdStyle}><div style={{ fontWeight: 700 }}>{product.name}</div><div style={{ color: "#64748B", fontSize: 12 }}>{product.unit}</div></td>
                <td style={tdStyle}>{product.category?.name || "-"}</td>
                <td style={tdStyle}>{product.brand || "-"}</td>
                <td style={tdStyle}>{product.batchNumber}</td>
                <td style={tdStyle}><span style={{ fontFamily: "monospace", fontSize: 12 }}>{product.qrCode}</span></td>
                <td style={tdStyle}>{product.criticalStock}</td>
                <td style={tdStyle}>{product.warehouseStock?.quantity ?? 0}</td>
                <td style={tdStyle}>{product.status === "ACTIVE" ? "Aktif" : "Pasif"}</td>
                <td style={tdStyle}>
                  <button type="button" onClick={() => handleDelete(product.id)} style={{ background: "#DC2626", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
                    Sil
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 12px",
  textAlign: "left",
  fontSize: 12,
  textTransform: "uppercase",
  color: "#64748B",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 12px",
  verticalAlign: "top",
};
