interface Rarity {
  label: string
  value: string
}

export const artworkRarityClassifications: Rarity[] = [
  { label: "Unique", value: "UNIQUE" },
  { label: "Limited Edition", value: "LIMITED_EDITION" },
  { label: "Open Edition", value: "OPEN_EDITION" },
  { label: "Unknown edition", value: "UNKNOWN_EDITION" },
]
