import { calculateDynamicTriggerIndex } from "app/Scenes/InfiniteDiscovery/helpers"

describe(calculateDynamicTriggerIndex, () => {
  it("returns 0 for 1 artwork", () => {
    expect(calculateDynamicTriggerIndex(1)).toBe(0)
  })

  it("returns 0 for 2 artworks", () => {
    expect(calculateDynamicTriggerIndex(2)).toBe(0)
  })

  it("returns 1 for 3 artworks", () => {
    expect(calculateDynamicTriggerIndex(3)).toBe(1)
  })

  it("returns 2 for 4 artworks", () => {
    expect(calculateDynamicTriggerIndex(4)).toBe(2)
  })

  it("returns 2 for 5+ artworks", () => {
    expect(calculateDynamicTriggerIndex(5)).toBe(2)
    expect(calculateDynamicTriggerIndex(10)).toBe(2)
    expect(calculateDynamicTriggerIndex(100)).toBe(2)
  })

  it("returns 0 for edge case of 0 artworks", () => {
    expect(calculateDynamicTriggerIndex(0)).toBe(0)
  })
})
