import { formatLargeNumber } from "app/utils/formatLargeNumber"

describe(formatLargeNumber, () => {
  describe("no decimal places specified", () => {
    it("returns the number when less than 1000", () => {
      expect(formatLargeNumber(132)).toEqual("132")
    })

    it("returns the number of thousands when less than 1m", () => {
      expect(formatLargeNumber(123456)).toEqual("123K")
    })

    it("returns the number of millions when less than 1b", () => {
      expect(formatLargeNumber(987654321)).toEqual("988M")
    })

    it("returns the number of billions when less than 1t which is totally going to happen soon", () => {
      expect(formatLargeNumber(543235234432)).toEqual("543B")
    })
  })

  describe("decimal places specified", () => {
    it("includes specified decimal places", () => {
      expect(formatLargeNumber(123456, 2)).toEqual("123.46K")
    })
  })
})
