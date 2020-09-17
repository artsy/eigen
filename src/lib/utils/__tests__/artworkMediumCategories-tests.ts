import { artworkMediumCategories } from "../artworkMediumCategories"

describe("artworkMediumCategories", () => {
  it("maps raw (Gravity) artwork category labels to their respective values", () => {
    expect(artworkMediumCategories.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {})).toEqual({
      ARCHITECTURE: "Architecture",
      DESIGN_DECORATIVE_ART: "Design/Decorative Art",
      DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER: "Drawing, Collage or other Work on Paper",
      FASHION_DESIGN_AND_WEARABLE_ART: "Fashion Design and Wearable Art",
      INSTALLATION: "Installation",
      JEWELRY: "Jewelry",
      MIXED_MEDIA: "Mixed Media",
      OTHER: "Other",
      PAINTING: "Painting",
      PERFORMANCE_ART: "Performance Art",
      PHOTOGRAPHY: "Photography",
      PRINT: "Print",
      SCULPTURE: "Sculpture",
      TEXTILE_ARTS: "Textile Arts",
      VIDEO_FILM_ANIMATION: "Video/Film/Animation",
    })
  })
})
