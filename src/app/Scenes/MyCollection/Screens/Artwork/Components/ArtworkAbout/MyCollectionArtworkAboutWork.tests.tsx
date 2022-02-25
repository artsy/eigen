import { getDimensionsText, getEstimatePrice } from "./MyCollectionArtworkAboutWork"

describe("getDimensionsText", () => {
  describe("returns the dimensions string", () => {
    it("when CM and IN are available", () => {
      expect(getDimensionsText({ in: "28 2/5 × 12 3/4 in", cm: "120 × 68 cm" })).toBe(
        "28 2/5 × 12 3/4 in\n120 × 68 cm"
      )
    })

    it("when only CM is available", () => {
      expect(getDimensionsText({ in: null, cm: "120 × 68 cm" })).toBe("120 × 68 cm")
    })

    it("when only IN is available", () => {
      expect(getDimensionsText({ in: "28 2/5 × 12 3/4 in", cm: null })).toBe("28 2/5 × 12 3/4 in")
    })
  })

  describe("returns an empty string", () => {
    it("when dimensions is null", () => {
      expect(getDimensionsText(null)).toBe("")
    })

    it("when values are null", () => {
      expect(getDimensionsText({ in: null, cm: null })).toBe("")
    })
  })
})

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
