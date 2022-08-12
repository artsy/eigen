const VALID_VORTEX_MEDIUMS: string[] = [
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

export const getVortexMedium = (medium: string | null, category: string | null): string => {
  return (VALID_VORTEX_MEDIUMS.includes(medium ?? "") ? medium : category) || ""
}

const CategoryAliases: { [key: string]: string } = {
  Unknown: "Other",
}

const categoryColorCode: { [key: string]: { color: string | null; importance: number } } = {
  Painting: { color: "#E2B929", importance: 10 },
  Sculpture: { color: "#9C88FF", importance: 9 },
  Print: { color: "#00A8FF", importance: 8 },
  "Drawing, Collage or other Work on Paper": { color: "#4CD137", importance: 7 },
  "Work on Paper": { color: "#4CD137", importance: 7 },
  Photography: { color: "#DA6722", importance: 6 },
  "Textile Arts": { color: "#C9184A", importance: 5 },
  "Mixed Media": { color: null, importance: 4 },
  "Video/Film/Animation": { color: "#0582CA", importance: 3 },
  Other: { color: null, importance: 2 },
  // No data yet
  "Performance Art": { color: null, importance: 0 },
  Installation: { color: null, importance: 0 },
  Architecture: { color: null, importance: 0 },
  "Fashion Design and Wearable Art": { color: null, importance: 0 },
  Jewelry: { color: null, importance: 0 },
  "Design/Decorative Art": { color: null, importance: 0 },
  Posters: { color: null, importance: 0 },
  "Books and Portfolios": { color: null, importance: 0 },
  "Ephemera or Merchandise": { color: null, importance: 0 },
  Reproduction: { color: null, importance: 0 },
  NFT: { color: null, importance: 0 },
}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const getCategoryForAlias = (category: string) => CategoryAliases[category] || category

export const computeCategoriesForChart = (
  categories: string[] | undefined = VALID_VORTEX_MEDIUMS
) => {
  const takenColors: { [key: string]: boolean } = {}
  const catForChart = categories.map((k) => {
    const key = getCategoryForAlias(k)
    let color = categoryColorCode[key]?.color ?? getRandomColor()
    const importance = categoryColorCode[key]?.importance ?? 0
    let maxCheckTimes = 20
    while (takenColors[color] && maxCheckTimes > 0) {
      // don't try for unique color more than 20 times
      color = getRandomColor()
      maxCheckTimes--
    }
    takenColors[color] = true
    return { name: key, color, importance }
  })
  // By keeping this sorted based on importance, we avoid jumping
  // flatlist when categories change.
  catForChart.sort((a, b) => b.importance - a.importance)

  return catForChart.map((cat) => ({ name: cat.name, color: cat.color }))
}
