import { moveStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"

describe("moveStop", () => {
  it("moves an item forward, shifting the ones in between back", () => {
    expect(moveStop(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"])
  })

  it("moves an item backward, shifting the ones in between forward", () => {
    expect(moveStop(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"])
  })

  it("is a no-op when the target index equals the source index", () => {
    const items = ["a", "b", "c"]
    expect(moveStop(items, 1, 1)).toEqual(items)
  })

  it("returns an unchanged copy for an out-of-range source index", () => {
    const items = ["a", "b", "c"]
    expect(moveStop(items, -1, 1)).toEqual(items)
    expect(moveStop(items, 3, 1)).toEqual(items)
  })

  it("returns an unchanged copy for an out-of-range target index", () => {
    const items = ["a", "b", "c"]
    expect(moveStop(items, 0, -1)).toEqual(items)
    expect(moveStop(items, 0, 3)).toEqual(items)
  })

  it("returns a new array rather than mutating the input", () => {
    const items = ["a", "b", "c"]
    const result = moveStop(items, 0, 2)
    expect(result).not.toBe(items)
    expect(items).toEqual(["a", "b", "c"])
  })
})
