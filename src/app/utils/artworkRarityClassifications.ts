export type AttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION"

interface ArtworkRarityClassification {
  name: string
  label: string
  value: AttributionClassType
  description: string
}

export const artworkRarityClassifications: ArtworkRarityClassification[] = [
  {
    name: "Unique",
    label: "Unique",
    value: "UNIQUE",
    description: "One-of-a-kind piece.",
  },
  {
    name: "Limited edition",
    label: "Limited Edition",
    value: "LIMITED_EDITION",
    description:
      "The edition run has ended; the number of works produced is known and included in the listing.",
  },
  {
    name: "Open edition",
    label: "Open Edition",
    value: "OPEN_EDITION",
    description:
      "The edition run is ongoing. New works are still being produced, which may be numbered. This includes made-to-order works.",
  },
  {
    name: "Unknown edition",
    label: "Unknown Edition",
    value: "UNKNOWN_EDITION",
    description:
      "The edition run has ended; it is unclear how many works were produced. Our partners are responsible for providing accurate classification information for all works.",
  },
]

export const getAttributionClassValueByName = (
  name?: string | null
): AttributionClassType | null => {
  return (
    artworkRarityClassifications.find((classification) => classification.name === name)?.value ??
    null
  )
}
