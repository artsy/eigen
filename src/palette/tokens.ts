export type SpacingUnit = "0.5" | "1" | "2" | "4" | "6" | "12"

const spacing: Record<SpacingUnit, `${number}px`> = {
  // unit: px value
  "0.5": "5px",
  "1": "10px",
  "2": "20px",
  "4": "40px",
  "6": "60px",
  "12": "120px",
}

export const tokens = {
  spacing,
}
