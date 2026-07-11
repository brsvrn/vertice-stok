export type ProductStatus = "ACTIVE" | "INACTIVE";

export type ProductValidationPayload = {
  name: string;
  categoryId: number | null;
  brand?: string;
  unit?: string;
  batchNumber?: string;
  expiryDate?: string | null;
  criticalStock?: number | null;
  status?: ProductStatus;
};

export function generateQrCode(productId: number | string) {
  return `VERTICE:${productId}`;
}

export function validateProductInput(payload: ProductValidationPayload) {
  const errors: string[] = [];

  if (!payload.name?.trim()) {
    errors.push("Ürün adı zorunlu.");
  }

  if (!payload.categoryId) {
    errors.push("Kategori seçimi zorunlu.");
  }

  if (payload.criticalStock !== undefined && payload.criticalStock !== null && payload.criticalStock < 0) {
    errors.push("Kritik stok değeri negatif olamaz.");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function calculateTotalStock(batches: Array<{ quantity?: number | null }>) {
  return batches.reduce((total, batch) => total + (batch.quantity ?? 0), 0);
}
