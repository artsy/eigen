export const getColorByMedium = (medium: string | null) => {
  if (!medium || medium === "All") {
    return ALL_COLOR
  }
  return (mediumToColor as any)[medium] || getRandomColor()
}

export const mediumToColor = {
  // Mediums with defined colors
  "Drawing, Collage, or other Work on paper": "#4CD137",
  "Textile Arts": "#C9184A",
  "Video/Film/Animation": "#0582CA",
  Painting: "#E2B929",
  Photography: "#DA6722",
  Print: "#00A8FF",
  Sculpture: "#9C88FF",

  // Mediums with undefined colors
  "Design/Decorative Art": "",
  "Fashion Design and Wearable Art": "",
  "Mixed media": "",
  "Performance Art": "",
  Architecture: "",
  Installation: "",
  Jewelry: "",
  Other: "",
}

export const ALL_COLOR = "#1023D7"

// Helper to get a random color
export const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
