import { getRandomIntInclusive } from "../getRandomInt"

describe("getRandomIntInclusive", () => {
  it("should return a number", () => {
    expect(getRandomIntInclusive(0, 10)).toBeNumber()
  })

  it("should return a number in the specified range", () => {
    const result = getRandomIntInclusive(0, 10)

    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(10)
  })
})
