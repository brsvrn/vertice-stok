export function calculateVariance(countedQuantity: number, expectedQuantity: number) {
  return countedQuantity - expectedQuantity;
}

export function formatInventoryVariance(variance: number) {
  return variance >= 0 ? `+${variance}` : `${variance}`;
}
