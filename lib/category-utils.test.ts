import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CATEGORY_SEEDS, validateCategoryInput } from "./category-utils";

test("validateCategoryInput rejects empty names", () => {
  const result = validateCategoryInput({ name: "   " });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("Kategori adı")));
});

test("validateCategoryInput accepts a valid name", () => {
  const result = validateCategoryInput({ name: "İçecek" });

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("default category seeds include core categories", () => {
  const names = DEFAULT_CATEGORY_SEEDS.map((category) => category.name);

  assert.ok(names.includes("İçecek"));
  assert.ok(names.includes("Atıştırmalık"));
});
