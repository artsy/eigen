interface Medium {
  label: string
  value: string
}

// List for my collection accepted mediums/categories
export const artworkMediumCategories: Medium[] = [
  { label: "Painting", value: "Painting" },
  { label: "Sculpture", value: "Sculpture" },
  { label: "Photography", value: "Photography" },
  { label: "Print", value: "Print" },
  {
    label: "Drawing, Collage or other Work on Paper",
    value: "Drawing, Collage or other Work on Paper",
  },
  { label: "Mixed Media", value: "Mixed Media" },
  { label: "Performance Art", value: "Performance Art" },
  { label: "Installation", value: "Installation" },
  { label: "Video/Film/Animation", value: "Video/Film/Animation" },
  { label: "Architecture", value: "Architecture" },
  { label: "Fashion Design and Wearable Art", value: "Fashion Design and Wearable Art" },
  { label: "Jewelry", value: "Jewelry" },
  { label: "Design/Decorative Art", value: "Design/Decorative Art" },
  { label: "Textile Arts", value: "Textile Arts" },
  { label: "Posters", value: "Posters" },
  { label: "Books and Portfolios", value: "Books and Portfolios" },
  { label: "Other", value: "Other" },
  { label: "Ephemera or Merchandise", value: "Ephemera or Merchandise" },
  { label: "Reproduction", value: "Reproduction" },
  { label: "NFT", value: "NFT" },
]

// List for medium/categories available in Gravity
export const gravityArtworkMediumCategories: { label: string; value: string }[] = [
  {
    label: "Architecture",
    value: "architecture-1",
  },
  {
    label: "Books and Portfolios",
    value: "books-and-portfolios",
  },
  {
    label: "Design",
    value: "design",
  },
  {
    label: "Work on Paper",
    value: "work-on-paper",
  },
  {
    label: "Ephemera or Merchandise",
    value: "ephemera-or-merchandise",
  },
  {
    label: "Fashion Design and Wearable Art",
    value: "fashion-design-and-wearable-art",
  },
  {
    label: "Installation",
    value: "installation",
  },
  {
    label: "Jewelry",
    value: "jewelry",
  },
  {
    label: "Mixed-Media",
    value: "mixed-media",
  },
  {
    label: "NFT",
    value: "nft",
  },
  {
    label: "Other",
    value: "other",
  },
  {
    label: "Painting",
    value: "painting",
  },
  {
    label: "Performance Art",
    value: "performance-art",
  },
  {
    label: "Photography",
    value: "photography",
  },
  {
    label: "Poster",
    value: "poster",
  },
  {
    label: "Prints",
    value: "prints",
  },
  {
    label: "Reproduction",
    value: "reproduction",
  },
  {
    label: "Sculpture",
    value: "sculpture",
  },
  {
    label: "Textile Arts",
    value: "textile-arts",
  },
  {
    label: "Film/Video",
    value: "film-slash-video",
  },
]
