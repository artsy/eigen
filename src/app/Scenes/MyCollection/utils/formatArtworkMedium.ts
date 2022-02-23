import { capitalize } from "lodash"

export const formatMedium = (medium: string): string => {
  const mediums: { [medium: string]: string } = {
    PAINTING: "Painting",
    SCULPTURE: "Sculpture",
    PHOTOGRAPHY: "Photography",
    INSTALLATION: "Installation",
    ARCHITECTURE: "Architecture",
    JEWELRY: "Jewelry",
    OTHER: "Other",
    PRINT: "Print",
    MIXED_MEDIA: "Mixed media",
    DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER: "Drawing, Collage, or other Work on paper",
    PERFORMANCE_ART: "Performance Art",
    VIDEO_FILM_ANIMATION: "Video/Film/Animation",
    FASHION_DESIGN_AND_WEARABLE_ART: "Fashion Design and Wearable Art",
    DESIGN_DECORATIVE_ART: "Design/Decorative Art",
    TEXTILE_ARTS: "Textile Arts",
  }
  return mediums[medium] || capitalize(medium)
}
