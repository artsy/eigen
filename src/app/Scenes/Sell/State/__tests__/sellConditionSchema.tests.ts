import { sellConditionSchema } from "app/Scenes/Sell/State/sellConditionSchema"

describe("sellConditionSchema", () => {
  describe("for a listing", () => {
    const schema = sellConditionSchema("MARKETPLACE")

    it("passes with a rating and an asking price", () => {
      expect(schema.isValidSync({ rating: "FAIR", askingPrice: "3200" })).toBe(true)
    })

    it("needs a rating", () => {
      expect(schema.isValidSync({ rating: null, askingPrice: "3200" })).toBe(false)
    })

    it("needs an asking price in whole dollars", () => {
      expect(schema.isValidSync({ rating: "FAIR", askingPrice: "" })).toBe(false)
      expect(schema.isValidSync({ rating: "FAIR", askingPrice: "0" })).toBe(false)
      expect(schema.isValidSync({ rating: "FAIR", askingPrice: "3200.50" })).toBe(false)
    })
  })

  describe("for an auction", () => {
    const schema = sellConditionSchema("AUCTION")

    it("needs only a rating", () => {
      expect(schema.isValidSync({ rating: "FAIR", askingPrice: "" })).toBe(true)
      expect(schema.isValidSync({ rating: null, askingPrice: "" })).toBe(false)
    })
  })
})
