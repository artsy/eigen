import { artworkMediumCategories } from "./artworkMediumCategories"

describe("artworkMediumCategories", () => {
  it("maps raw (Gravity) artwork category labels to their respective values", () => {
    expect(
      artworkMediumCategories.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {})
    ).toEqual({
      Architecture: "Architecture",
      "Design/Decorative Art": "Design/Decorative Art",
      "Drawing, Collage or other Work on Paper": "Drawing, Collage or other Work on Paper",
      "Fashion Design and Wearable Art": "Fashion Design and Wearable Art",
      Installation: "Installation",
      Jewelry: "Jewelry",
      "Mixed Media": "Mixed Media",
      Other: "Other",
      Painting: "Painting",
      "Performance Art": "Performance Art",
      Photography: "Photography",
      Print: "Print",
      Sculpture: "Sculpture",
      "Textile Arts": "Textile Arts",
      "Video/Film/Animation": "Video/Film/Animation",
    })
  })
})
