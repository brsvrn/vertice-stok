export type WarehouseType = "MAIN" | "BAR";

export type MovementType =
  | "IN"
  | "OUT"
  | "TRANSFER"
  | "COUNT";

export type MovementReason =
  | "PURCHASE"
  | "SALE"
  | "BREAKAGE"
  | "STAFF"
  | "GIFT"
  | "RETURN"
  | "COUNT"
  | "OTHER";

export type UserRole =
  | "ADMIN"
  | "WAREHOUSE"
  | "BAR";
