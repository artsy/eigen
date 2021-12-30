interface Rarity {
  label: string
  value: string
  description: string
}

export const artworkRarityClassifications: Rarity[] = [
  { label: "Unique", value: "UNIQUE", description: "One-of-a-kind piece." },
  {
    label: "Limited Edition",
    value: "LIMITED_EDITION",
    description: "The edition run has ended; the number of works produced is known and included in the listing.",
  },
  {
    label: "Open Edition",
    value: "OPEN_EDITION",
    description:
      "The edition run is ongoing. New works are still being produced, which may be numbered. This includes made-to-order works.",
  },
  {
    label: "Unknown edition",
    value: "UNKNOWN_EDITION",
    description:
      "The edition run has ended; it is unclear how many works were produced. Our partners are responsible for providing accurate classification information for all works.",
  },
]
