const VALID_VORTEX_MEDIUMS: Array<string | null> = [
  "Painting",
  "Sculpture",
  "Photography",
  "Print",
  "Drawing, Collage or other Work on Paper",
  "Mixed Media",
  "Performance Art",
  "Installation",
  "Video/Film/Animation",
  "Architecture",
  "Fashion Design and Wearable Art",
  "Jewelry",
  "Design/Decorative Art",
  "Textile Arts",
  "Posters",
  "Books and Portfolios",
  "Other",
  "Ephemera or Merchandise",
  "Reproduction",
  "NFT",
]

export const getVortexMedium = (medium: string | null, category: string | null) => {
  return (VALID_VORTEX_MEDIUMS.includes(medium) ? medium : category) || ""
}
