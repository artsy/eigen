import { artworkMediumCategories } from "app/utils/artworkMediumCategories"

describe("artworkMediumCategories", () => {
  it("maps raw (Gravity) artwork category labels to their respective values", () => {
    expect(
      artworkMediumCategories.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {})
    ).toEqual({
      Painting: "Painting",
      Sculpture: "Sculpture",
      Photography: "Photography",
      Print: "Print",
      "Drawing, Collage or other Work on Paper": "Drawing, Collage or other Work on Paper",
      "Mixed Media": "Mixed Media",
      "Performance Art": "Performance Art",
      Installation: "Installation",
      "Video/Film/Animation": "Video/Film/Animation",
      Architecture: "Architecture",
      "Fashion Design and Wearable Art": "Fashion Design and Wearable Art",
      Jewelry: "Jewelry",
      "Design/Decorative Art": "Design/Decorative Art",
      "Textile Arts": "Textile Arts",
      Posters: "Posters",
      "Books and Portfolios": "Books and Portfolios",
      Other: "Other",
      "Ephemera or Merchandise": "Ephemera or Merchandise",
      Reproduction: "Reproduction",
      NFT: "NFT",
    })
  })
})
