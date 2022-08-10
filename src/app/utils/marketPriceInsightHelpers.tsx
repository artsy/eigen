const VALID_VORTEX_MEDIUMS = [
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

export const getVortexMedium = (medium: string, category: string) => {
  return VALID_VORTEX_MEDIUMS.includes(medium) ? medium : category
}

const categoryColorCode: { [key: string]: string | null } = {
  // TODO: Make sure all categories have color code. Discuss with Design.
  Painting: "#E2B929",
  Sculpture: "#9C88FF",
  Photography: "#DA6722",
  Print: "#00A8FF",
  "Drawing, Collage or other Work on Paper": "#4CD137",
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

export const computeCategoriesForChart = (selectedCategory: string) => {
  const takenColors: { [key: string]: boolean } = {}
  const keys = Object.keys(categoryColorCode).filter((k) => k !== selectedCategory)

  const catForChart = keys.map((k) => {
    let color = categoryColorCode[k] ?? getRandomColor()
    let maxCheckTimes = 20
    while (takenColors[color] && maxCheckTimes > 0) {
      // don't try for unique color more than 20 times
      color = getRandomColor()
      maxCheckTimes--
    }
    takenColors[color] = true
    return { name: k, color }
  })

  catForChart.unshift({
    name: selectedCategory,
    color: categoryColorCode[selectedCategory] ?? getRandomColor(),
  })
  return catForChart
}
