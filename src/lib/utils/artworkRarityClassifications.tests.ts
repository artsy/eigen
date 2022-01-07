import { artworkRarityClassifications } from "./artworkRarityClassifications"

describe("artworkRarityClassifications", () => {
  it("maps raw (Gravity) artwork category labels to their respective values", () => {
    expect(artworkRarityClassifications.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {})).toEqual({
      UNIQUE: "Unique",
      LIMITED_EDITION: "Limited Edition",
      OPEN_EDITION: "Open Edition",
      UNKNOWN_EDITION: "Unknown edition",
    })
  })
})
