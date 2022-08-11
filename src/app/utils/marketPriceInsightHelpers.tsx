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

export const getVortexMedium = (medium: string | null, category: string | null): string => {
  return (VALID_VORTEX_MEDIUMS.includes(medium) ? medium : category) || ""
}

const CategoryAliases: { [key: string]: string } = {
  Unknown: "Other",
}

const categoryColorCode: { [key: string]: string | null } = {
  // TODO: Make sure all categories have color code. Discuss with Design.
  Painting: "#E2B929",
  Sculpture: "#9C88FF",
  Photography: "#DA6722",
  Print: "#00A8FF",
  "Drawing, Collage or other Work on Paper": "#4CD137",
  "Work on Paper": "#4CD137",
  "Video/Film/Animation": "#0582CA",
  "Textile Arts": "#C9184A",
  // No color code yet
  "Mixed Media": null,
  "Performance Art": null,
  Installation: null,
  Architecture: null,
  "Fashion Design and Wearable Art": null,
  Jewelry: null,
  "Design/Decorative Art": null,
  Posters: null,
  "Books and Portfolios": null,
  Other: null,
  "Ephemera or Merchandise": null,
  Reproduction: null,
  NFT: null,
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
  selectedCategory: string,
  categories: string[] | undefined = VALID_VORTEX_MEDIUMS
) => {
  const takenColors: { [key: string]: boolean } = {}
  const keys = categories.filter((k) => k !== selectedCategory)

  const catForChart = keys.map((k) => {
    const key = getCategoryForAlias(k)
    let color = categoryColorCode[key] ?? getRandomColor()
    let maxCheckTimes = 20
    while (takenColors[color] && maxCheckTimes > 0) {
      // don't try for unique color more than 20 times
      color = getRandomColor()
      maxCheckTimes--
    }
    takenColors[color] = true
    return { name: key, color }
  })

  catForChart.unshift({
    name: selectedCategory,
    color: categoryColorCode[selectedCategory] ?? getRandomColor(),
  })
  return catForChart
}
