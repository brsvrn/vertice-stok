"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateQrCode } from "../../lib/product-utils";

type Category = {
  id: number;
  name: string;
};

type ProductFormProps = {
  categories: Category[];
};

const initialState = {
  name: "",
  categoryId: "",
  brand: "",
  unit: "Adet",
  batchNumber: "",
  expiryDate: "",
  criticalStock: "10",
  status: "ACTIVE",
};

export default function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({ ...current, categoryId: categories[0]?.id ? String(categories[0].id) : "" }));
  }, [categories]);

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      criticalStock: Number(form.criticalStock),
      qrCode: generateQrCode(form.batchNumber, form.brand),
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Ürün eklenemedi.");
      setIsSubmitting(false);
      return;
    }

    setSuccess("Ürün başarıyla eklendi.");
    setForm(initialState);
    router.refresh();
    setTimeout(() => router.push("/products"), 800);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      {error ? (
        <div style={{ padding: 12, borderRadius: 8, background: "#FEE2E2", color: "#B91C1C" }}>{error}</div>
      ) : null}
      {success ? (
        <div style={{ padding: 12, borderRadius: 8, background: "#DCFCE7", color: "#166534" }}>{success}</div>
      ) : null}

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Ürün adı</span>
          <input required value={form.name} onChange={(event) => handleChange("name", event.target.value)} style={inputStyle} placeholder="Örn. Kahve" />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Kategori</span>
          <select required value={form.categoryId} onChange={(event) => handleChange("categoryId", event.target.value)} style={inputStyle}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Marka</span>
          <input value={form.brand} onChange={(event) => handleChange("brand", event.target.value)} style={inputStyle} placeholder="Örn. Nero" />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Birim</span>
          <input value={form.unit} onChange={(event) => handleChange("unit", event.target.value)} style={inputStyle} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Parti numarası</span>
          <input required value={form.batchNumber} onChange={(event) => handleChange("batchNumber", event.target.value)} style={inputStyle} placeholder="BATCH-001" />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Son kullanma tarihi</span>
          <input type="date" value={form.expiryDate} onChange={(event) => handleChange("expiryDate", event.target.value)} style={inputStyle} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Kritik stok</span>
          <input type="number" min="0" value={form.criticalStock} onChange={(event) => handleChange("criticalStock", event.target.value)} style={inputStyle} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Ürün durumu</span>
          <select value={form.status} onChange={(event) => handleChange("status", event.target.value)} style={inputStyle}>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} style={{ ...buttonStyle, background: isSubmitting ? "#64748B" : "#2563EB" }}>
        {isSubmitting ? "Ekleniyor..." : "Ürün ekle"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontWeight: 700,
};
