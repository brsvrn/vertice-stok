import test from "node:test";
import assert from "node:assert/strict";

import { calculateTotalStock, generateQrCode, validateProductInput } from "./product-utils";

test("generateQrCode creates a deterministic QR format", () => {
  const qrCode = generateQrCode("ABC123");

  assert.match(qrCode, /^VERTICE:/);
  assert.ok(qrCode.includes("ABC123"));
});

test("validateProductInput rejects missing required fields", () => {
  const result = validateProductInput({
    name: "",
    categoryId: 1,
    batchNumber: "",
    brand: "Test",
    unit: "Adet",
    criticalStock: 5,
    status: "ACTIVE",
  });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("Ürün adı")));
});

test("validateProductInput accepts a valid payload", () => {
  const result = validateProductInput({
    name: "Kahve",
    categoryId: 1,
    batchNumber: "BATCH-001",
    brand: "Nero",
    unit: "Adet",
    criticalStock: 10,
    status: "ACTIVE",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("calculateTotalStock sums all batch quantities", () => {
  const totalStock = calculateTotalStock([
    { quantity: 10 },
    { quantity: 25 },
    { quantity: 5 },
  ] as Array<{ quantity: number }>);

  assert.equal(totalStock, 40);
});
