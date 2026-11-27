import { isPriceRangeInverted } from "app/Components/PriceRange/utils"

describe("isPriceRangeInverted", () => {
  it("is true when max is lower than min", () => {
    expect(isPriceRangeInverted([200, 199])).toBe(true)
  })

  it("is false for a valid range", () => {
    expect(isPriceRangeInverted([200, 200])).toBe(false)
    expect(isPriceRangeInverted([200, 500])).toBe(false)
  })

  it("is false when either end is open", () => {
    expect(isPriceRangeInverted(["*", 199])).toBe(false)
    expect(isPriceRangeInverted([200, "*"])).toBe(false)
    expect(isPriceRangeInverted(["*", "*"])).toBe(false)
  })
})
