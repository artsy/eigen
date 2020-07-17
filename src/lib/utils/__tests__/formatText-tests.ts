import { formatText } from "../formatText"

describe(formatText, () => {
  describe("default pluralization", () => {
    it("formats a single item", () => {
      expect(formatText(1, "artwork")).toMatchInlineSnapshot(`"1 artwork"`)
    })
    it("formats less than a thousand", () => {
      expect(formatText(850, "artwork")).toMatchInlineSnapshot(`"850 artworks"`)
    })
    it("formats more than a thousand less than a million", () => {
      expect(formatText(151000, "artwork")).toMatchInlineSnapshot(`"151.0k artworks"`)
    })
    it("formats more than a million", () => {
      expect(formatText(2200000, "artwork")).toMatchInlineSnapshot(`"2.2m artworks"`)
    })
  })

  describe("custom pluralization", () => {
    it("formats a single item", () => {
      expect(formatText(1, "work for sale", "works for sale")).toMatchInlineSnapshot(`"1 work for sale"`)
    })
    it("formats less than a thousand", () => {
      expect(formatText(850, "work for sale", "works for sale")).toMatchInlineSnapshot(`"850 works for sale"`)
    })
    it("formats more than a thousand less than a million", () => {
      expect(formatText(151000, "work for sale", "works for sale")).toMatchInlineSnapshot(`"151.0k works for sale"`)
    })
    it("formats more than a million", () => {
      expect(formatText(2200000, "work for sale", "works for sale")).toMatchInlineSnapshot(`"2.2m works for sale"`)
    })
  })
})
