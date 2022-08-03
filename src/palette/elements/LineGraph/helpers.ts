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

export enum TickFormatType {
  OnlyShowMinAndMaxDomain = "OnlyShowMinAndMaxDomain",
  ShowAllValues = "ShowAllValues",
}

const defaultFormatter = (val: any) => {
  if (isNaN(Number(val))) {
    return val
  }
  const inThousand = Number(val) / 1000
  if (inThousand > 0.99) {
    return Math.ceil(inThousand) + "k"
  }
  return val
}

export const tickFormat = (
  tick: any,
  maxDomain: number,
  formatter: (val: any) => string = defaultFormatter,
  tickFormatType: TickFormatType = TickFormatType.ShowAllValues
): string => {
  let res = ""
  switch (tickFormatType) {
    case TickFormatType.OnlyShowMinAndMaxDomain:
      if (tick === maxDomain) {
        res = formatter(tick)
      }
      break
    case TickFormatType.ShowAllValues:
      res = formatter(tick)
      break
  }
  return res
}
