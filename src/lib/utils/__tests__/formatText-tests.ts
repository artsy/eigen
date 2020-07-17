import { formatText } from "../formatText"

describe(formatText, () => {
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
