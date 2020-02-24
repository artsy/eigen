import { limitWithCount } from "../limitWithCount"

describe("limitWithCount", () => {
  it("returns empty array if no array of strings is given", () => {
    const limited = limitWithCount(null, 3)
    expect(limited).toEqual([])
  })

  it("returns initial array if limit number is more then elements in initial array", () => {
    const limited = limitWithCount(["let", "there", "be", "light"], 8)
    expect(limited).toEqual(["let", "there", "be", "light"])
  })

  it("returns initial array if limit number is same as elements in initial array", () => {
    const limited = limitWithCount(["let", "there", "be", "light"], 4)
    expect(limited).toEqual(["let", "there", "be", "light"])
  })

  it("returns limited array according to limit", () => {
    const limited = limitWithCount(["let", "there", "be", "light"], 2)
    expect(limited).toEqual(["let", "there", "+2 more"])
  })
})
