export const pluralizeMedium = (medium: string): string => {
  const mediums: { [medium: string]: string } = {
    Painting: "paintings",
    Sculpture: "sculptures",
    Photography: "photographs",
    Installation: "installations",
    Architecture: "architecture",
    Jewelry: "jewelry",
    Print: "prints",
    "Mixed Media": "mixed media",
    "Drawing, Collage or other Work on Paper": "drawings, collages, or other works on paper",
    "Performance Art": "performance art",
    "Video/Film/Animation": "video/film/animation",
    "Fashion Design and Wearable Art": "fashion, design, and wearable art",
    "Design/Decorative Art": "design/decorative art",
    "Textile Arts": "textile arts",
    Other: "other",
  }
  return mediums[medium] || "other"
}
