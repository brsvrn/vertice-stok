"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateTotalStock } from "../../lib/product-utils";

type Category = { id: number; name: string };

type ProductBatch = { id: number; batchNumber: string; expiryDate: string | null; quantity: number; warehouseName: string };

type Product = {
  id: number;
  name: string;
  brand: string;
  unit: string;
  criticalStock: number;
  status: string;
  qrCode: string;
  category: { name: string };
  batches: ProductBatch[];
  rackCode?: string | null;
};

type ProductManagerProps = { initialProducts: Product[]; categories: Category[] };

type ModalType = "qr" | "stock-in" | "transfer" | null;

type FormState = {
  name: string;
  categoryId: string;
  brand: string;
  unit: string;
  criticalStock: string;
  status: string;
  rackCode: string;
  batchNumber: string;
  expiryDate: string;
  quantity: string;
  warehouseName: string;
};

const initialFormState: FormState = {
  name: "",
  categoryId: "",
  brand: "",
  unit: "Adet",
  criticalStock: "10",
  status: "ACTIVE",
  rackCode: "",
  batchNumber: "",
  expiryDate: "",
  quantity: "0",
  warehouseName: "Ana Depo",
};

export default function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockInForm, setStockInForm] = useState({ amount: "", batchNumber: "", expiryDate: "", warehouse: "Ana Depo" });
  const [transferForm, setTransferForm] = useState({ sourceWarehouse: "Ana Depo", targetWarehouse: "Bar", amount: "" });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingProductId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const payload = {
      name: form.name,
      categoryId: Number(form.categoryId),
      brand: form.brand,
      unit: form.unit,
      criticalStock: Number(form.criticalStock),
      status: form.status,
      rackCode: form.rackCode,
      batchNumber: form.batchNumber,
      expiryDate: form.expiryDate,
      quantity: Number(form.quantity),
      warehouseName: form.warehouseName,
    };

    const response = editingProductId
      ? await fetch(`/api/products/${editingProductId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "İşlem gerçekleştirilemedi.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(editingProductId ? "Ürün başarıyla güncellendi." : "Ürün ve ilk parti başarıyla eklendi.");
    setIsSubmitting(false);
    resetForm();
    router.refresh();
    setProducts((current) => {
      if (editingProductId) {
        return current.map((product) => (product.id === editingProductId ? { ...product, ...result } : product));
      }

      return [{ id: result.id, name: result.name, brand: result.brand, unit: result.unit, criticalStock: result.criticalStock, status: result.status, qrCode: result.qrCode, category: result.category, batches: result.batches || [], rackCode: result.rackCode || null }, ...current];
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      categoryId: categories.find((category) => category.name === product.category.name)?.id?.toString() || "",
      brand: product.brand,
      unit: product.unit,
      criticalStock: String(product.criticalStock),
      status: product.status,
      rackCode: product.rackCode || "",
      batchNumber: "",
      expiryDate: "",
      quantity: "0",
      warehouseName: "Ana Depo",
    });
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProducts((current) => current.filter((product) => product.id !== id));
      router.refresh();
    }
  };

  const openModal = (type: ModalType, product: Product) => {
    setActiveModal(type);
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProduct(null);
  };

  const handleStockIn = async (productId: number) => {
    if (!selectedProduct) return;
    const response = await fetch("/api/products/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        batchNumber: stockInForm.batchNumber || `${selectedProduct.name.toUpperCase()}-${Date.now()}`,
        expiryDate: stockInForm.expiryDate,
        quantity: Number(stockInForm.amount ?? 0),
        warehouseName: stockInForm.warehouse,
      }),
    });

    if (response.ok) {
      await fetch("/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movementType: "STOCK_IN",
          productId,
          quantity: Number(stockInForm.amount ?? 0),
          sourceWarehouse: stockInForm.warehouse,
          targetWarehouse: stockInForm.warehouse,
          userName: "Sistem",
          description: "Stok girişi",
        }),
      });
      router.refresh();
      closeModal();
      setSuccess("Stok girişi kaydedildi.");
    }
  };

  const handleTransfer = async (productId: number) => {
    if (!selectedProduct) return;
    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity: Number(transferForm.amount ?? 0),
        sourceWarehouse: transferForm.sourceWarehouse,
        targetWarehouse: transferForm.targetWarehouse,
        userName: "Sistem",
        description: "Transfer",
      }),
    });

    if (response.ok) {
      router.refresh();
      closeModal();
      setSuccess("Transfer kaydedildi.");
    }
  };

  const summary = useMemo(() => `${products.length} ürün kayıtlı`, [products.length]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>{editingProductId ? "Ürünü güncelle" : "Yeni ürün ve ilk parti"}</h2>
        {error ? <div style={{ marginBottom: 12, padding: 10, borderRadius: 10, background: "#FEF2F2", color: "#B91C1C" }}>{error}</div> : null}
        {success ? <div style={{ marginBottom: 12, padding: 10, borderRadius: 10, background: "#ECFDF3", color: "#166534" }}>{success}</div> : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <label style={labelStyle}><span>Ürün Adı</span><input required value={form.name} onChange={(event) => handleChange("name", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>Kategori</span><select required value={form.categoryId} onChange={(event) => handleChange("categoryId", event.target.value)} style={inputStyle}><option value="">Seçiniz</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label style={labelStyle}><span>Raf Kodu</span><input value={form.rackCode} onChange={(event) => handleChange("rackCode", event.target.value)} style={inputStyle} placeholder="A-01-03" /></label>
            <label style={labelStyle}><span>Kritik Stok</span><input type="number" min="0" value={form.criticalStock} onChange={(event) => handleChange("criticalStock", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>Parti No</span><input required value={form.batchNumber} onChange={(event) => handleChange("batchNumber", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>SKT</span><input type="date" value={form.expiryDate} onChange={(event) => handleChange("expiryDate", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>İlk Stok Miktarı</span><input type="number" min="0" value={form.quantity} onChange={(event) => handleChange("quantity", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>Depo</span><input value={form.warehouseName} onChange={(event) => handleChange("warehouseName", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>Marka</span><input value={form.brand} onChange={(event) => handleChange("brand", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>Birim</span><input value={form.unit} onChange={(event) => handleChange("unit", event.target.value)} style={inputStyle} /></label>
            <label style={labelStyle}><span>Durum</span><select value={form.status} onChange={(event) => handleChange("status", event.target.value)} style={inputStyle}><option value="ACTIVE">Aktif</option><option value="INACTIVE">Pasif</option></select></label>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="submit" disabled={isSubmitting} style={{ ...buttonStyle, background: isSubmitting ? "#64748B" : "#2563EB" }}>{isSubmitting ? "Kaydediliyor..." : editingProductId ? "Güncelle" : "Kaydet"}</button>
            {editingProductId ? <button type="button" onClick={resetForm} style={{ ...buttonStyle, background: "#64748B" }}>İptal</button> : null}
          </div>
        </form>
      </section>

      <section style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div><h2 style={{ margin: 0 }}>Ürün Listesi</h2><div style={{ color: "#64748B", fontSize: 14 }}>{summary}</div></div>
        </div>
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table style={{ width: "100%", minWidth: 1200, borderCollapse: "collapse" }}>
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <th style={thStyle}>QR</th><th style={thStyle}>Ürün</th><th style={thStyle}>Kategori</th><th style={thStyle}>Raf</th><th style={thStyle}>Parti</th><th style={thStyle}>SKT</th><th style={thStyle}>Depo Stok</th><th style={thStyle}>Bar Stok</th><th style={thStyle}>Toplam</th><th style={thStyle}>Kritik</th><th style={thStyle}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const depoStock = product.batches.filter((batch) => batch.warehouseName === "Ana Depo").reduce((sum, batch) => sum + batch.quantity, 0);
                const barStock = product.batches.filter((batch) => batch.warehouseName === "Bar").reduce((sum, batch) => sum + batch.quantity, 0);
                const totalStock = depoStock + barStock;
                return (
                  <tr key={product.id} style={{ borderTop: "1px solid #E2E8F0" }}>
                    <td style={tdStyle}><button type="button" onClick={() => openModal("qr", product)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 999, padding: "8px 10px", cursor: "pointer" }}>QR</button></td>
                    <td style={tdStyle}><div style={{ fontWeight: 700 }}>{product.name}</div><div style={{ color: "#64748B", fontSize: 12 }}>{product.brand || "-"}</div></td>
                    <td style={tdStyle}>{product.category?.name || "-"}</td>
                    <td style={tdStyle}>{product.rackCode || "-"}</td>
                    <td style={tdStyle}>{product.batches[0]?.batchNumber || "-"}</td>
                    <td style={tdStyle}>{product.batches[0]?.expiryDate ? new Date(product.batches[0].expiryDate).toLocaleDateString("tr-TR") : "-"}</td>
                    <td style={tdStyle}>{depoStock}</td>
                    <td style={tdStyle}>{barStock}</td>
                    <td style={tdStyle}>{totalStock}</td>
                    <td style={tdStyle}>{product.criticalStock}</td>
                    <td style={tdStyle}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={() => handleEdit(product)} style={{ ...actionButtonStyle, background: "#2563EB" }}>Düzenle</button><button type="button" onClick={() => handleDelete(product.id)} style={{ ...actionButtonStyle, background: "#DC2626" }}>Sil</button><button type="button" onClick={() => openModal("stock-in", product)} style={{ ...actionButtonStyle, background: "#0F766E" }}>Stok Girişi</button><button type="button" onClick={() => openModal("transfer", product)} style={{ ...actionButtonStyle, background: "#7C3AED" }}>Transfer</button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {activeModal && selectedProduct ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 20, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{activeModal === "qr" ? "QR Kodu" : activeModal === "stock-in" ? "Stok Girişi" : "Transfer"}</h3>
              <button type="button" onClick={closeModal} style={{ border: "none", background: "#fff", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            {activeModal === "qr" ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ minHeight: 180, display: "grid", placeItems: "center", border: "1px dashed #CBD5E1", borderRadius: 16, background: "#F8FAFC" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedProduct.qrCode}</div>
                </div>
                <button type="button" onClick={() => window.print()} style={{ ...buttonStyle, background: "#2563EB" }}>Yazdır</button>
              </div>
            ) : null}
            {activeModal === "stock-in" ? (
              <div style={{ display: "grid", gap: 12 }}>
                <label style={labelStyle}><span>Miktar</span><input type="number" value={stockInForm.amount} onChange={(event) => setStockInForm((current) => ({ ...current, amount: event.target.value }))} style={inputStyle} /></label>
                <label style={labelStyle}><span>Parti</span><input value={stockInForm.batchNumber} onChange={(event) => setStockInForm((current) => ({ ...current, batchNumber: event.target.value }))} style={inputStyle} /></label>
                <label style={labelStyle}><span>SKT</span><input type="date" value={stockInForm.expiryDate} onChange={(event) => setStockInForm((current) => ({ ...current, expiryDate: event.target.value }))} style={inputStyle} /></label>
                <label style={labelStyle}><span>Depo</span><select value={stockInForm.warehouse} onChange={(event) => setStockInForm((current) => ({ ...current, warehouse: event.target.value }))} style={inputStyle}><option value="Ana Depo">Ana Depo</option><option value="Bar">Bar</option></select></label>
                <button type="button" onClick={() => handleStockIn(selectedProduct.id)} style={{ ...buttonStyle, background: "#0F766E" }}>Kaydet</button>
              </div>
            ) : null}
            {activeModal === "transfer" ? (
              <div style={{ display: "grid", gap: 12 }}>
                <label style={labelStyle}><span>Kaynak Depo</span><select value={transferForm.sourceWarehouse} onChange={(event) => setTransferForm((current) => ({ ...current, sourceWarehouse: event.target.value }))} style={inputStyle}><option value="Ana Depo">Ana Depo</option><option value="Bar">Bar</option></select></label>
                <label style={labelStyle}><span>Hedef Depo</span><select value={transferForm.targetWarehouse} onChange={(event) => setTransferForm((current) => ({ ...current, targetWarehouse: event.target.value }))} style={inputStyle}><option value="Ana Depo">Ana Depo</option><option value="Bar">Bar</option></select></label>
                <label style={labelStyle}><span>Miktar</span><input type="number" value={transferForm.amount} onChange={(event) => setTransferForm((current) => ({ ...current, amount: event.target.value }))} style={inputStyle} /></label>
                <button type="button" onClick={() => handleTransfer(selectedProduct.id)} style={{ ...buttonStyle, background: "#7C3AED" }}>Kaydet</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "grid", gap: 6, fontWeight: 600, color: "#334155" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: 10, fontSize: 14 };
const buttonStyle: React.CSSProperties = { padding: "12px 16px", borderRadius: 10, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" };
const actionButtonStyle: React.CSSProperties = { padding: "8px 10px", borderRadius: 8, border: "none", color: "#fff", cursor: "pointer" };
const thStyle: React.CSSProperties = { padding: "14px 12px", textAlign: "left", fontSize: 12, color: "#64748B", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { padding: "14px 12px", verticalAlign: "top" };
