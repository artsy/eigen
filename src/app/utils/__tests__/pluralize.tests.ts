import { pluralize } from "app/utils/pluralize"

describe("pluralize", () => {
  it("should return the word if count is 1", () => {
    expect(pluralize("apple", 1)).toBe("apple")
    expect(pluralize("person", 1, "people")).toBe("person")
  })

  it("should return the plural of word if count is 0 or more than 1", () => {
    expect(pluralize("apple", 2)).toBe("apples")
    expect(pluralize("apple", 0)).toBe("apples")
    expect(pluralize("person", 2, "people")).toBe("people")
    expect(pluralize("person", 0, "people")).toBe("people")
  })
})
