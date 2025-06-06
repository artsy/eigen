import { getEstimatePrice } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkAbout/MyCollectionArtworkAboutWork"

describe("getEstimatePrice", () => {
  describe("returns the estimate price string", () => {
    it("when the values are available", () => {
      expect(getEstimatePrice({ lowRangeCents: 12449, highRangeCents: 13454 })).toBe("$124 - $135")
    })
  })

  describe("returns an empty string", () => {
    it("when values are unavailable", () => {
      expect(getEstimatePrice({ lowRangeCents: null, highRangeCents: null })).toBe("")
    })
  })
})
