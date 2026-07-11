import test from "node:test";
import assert from "node:assert/strict";
import { calculateVariance, formatInventoryVariance } from "./inventory-utils";

test("calculateVariance returns counted minus expected", () => {
  assert.equal(calculateVariance(120, 100), 20);
  assert.equal(calculateVariance(80, 100), -20);
});

test("formatInventoryVariance shows positive and negative values clearly", () => {
  assert.equal(formatInventoryVariance(20), "+20");
  assert.equal(formatInventoryVariance(-20), "-20");
});
