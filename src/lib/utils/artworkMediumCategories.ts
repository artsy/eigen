interface Medium {
  label: string
  value: string
}

export const artworkMediumCategories: Medium[] = [
  { label: "Painting", value: "Painting" },
  { label: "Sculpture", value: "Sculpture" },
  { label: "Photography", value: "Photography" },
  { label: "Print", value: "Print" },
  { label: "Drawing, Collage or other Work on Paper", value: "Drawing, Collage or other Work on Paper" },
  { label: "Mixed Media", value: "Mixed Media" },
  { label: "Performance Art", value: "Performance Art" },
  { label: "Installation", value: "Installation" },
  { label: "Video/Film/Animation", value: "Video/Film/Animation" },
  { label: "Architecture", value: "Architecture" },
  { label: "Fashion Design and Wearable Art", value: "Fashion Design and Wearable Art" },
  { label: "Jewelry", value: "Jewelry" },
  { label: "Design/Decorative Art", value: "Design/Decorative Art" },
  { label: "Textile Arts", value: "Textile Arts" },
  { label: "Other", value: "Other" },
]

export const artworkRarityClassifications: Medium[] = [
  { label: "Unique", value: "UNIQUE" },
  { label: "Limited Edition", value: "LIMITED_EDITION" },
  { label: "Open Edition", value: "OPEN_EDITION" },
  { label: "Unknown edition", value: "UNKNOWN_EDITION" },
]
