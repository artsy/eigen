import { formatLargeNumberOfItems } from "app/utils/formatLargeNumberOfItems"

describe(formatLargeNumberOfItems, () => {
  describe("default pluralization", () => {
    it("formats a single item", () => {
      expect(formatLargeNumberOfItems(1, "artwork")).toMatchInlineSnapshot(`"1 artwork"`)
    })
    it("formats less than a thousand", () => {
      expect(formatLargeNumberOfItems(850, "artwork")).toMatchInlineSnapshot(`"850 artworks"`)
    })
    it("formats more than a thousand less than a million", () => {
      expect(formatLargeNumberOfItems(151000, "artwork")).toMatchInlineSnapshot(`"151.0K artworks"`)
    })
    it("formats more than a million", () => {
      expect(formatLargeNumberOfItems(2200000, "artwork")).toMatchInlineSnapshot(`"2.2M artworks"`)
    })
  })

  describe("custom pluralization", () => {
    it("formats a single item", () => {
      expect(formatLargeNumberOfItems(1, "work for sale", "works for sale")).toMatchInlineSnapshot(
        `"1 work for sale"`
      )
    })
    it("formats less than a thousand", () => {
      expect(
        formatLargeNumberOfItems(850, "work for sale", "works for sale")
      ).toMatchInlineSnapshot(`"850 works for sale"`)
    })
    it("formats more than a thousand less than a million", () => {
      expect(
        formatLargeNumberOfItems(151000, "work for sale", "works for sale")
      ).toMatchInlineSnapshot(`"151.0K works for sale"`)
    })
    it("formats more than a million", () => {
      expect(
        formatLargeNumberOfItems(2200000, "work for sale", "works for sale")
      ).toMatchInlineSnapshot(`"2.2M works for sale"`)
    })
  })
})
