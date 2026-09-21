import {
  dropIndex,
  moveStop,
  siblingShifts,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"

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

describe("dropIndex", () => {
  const uniform = [100, 100, 100, 100]

  it("stays at the source index with no vertical movement", () => {
    expect(dropIndex(uniform, 1, 0)).toBe(1)
  })

  it("stays put while the drag hasn't crossed half the next row", () => {
    expect(dropIndex(uniform, 0, 49)).toBe(0)
  })

  it("crosses to the next row once the drag passes half its span", () => {
    expect(dropIndex(uniform, 0, 51)).toBe(1)
  })

  it("crosses several rows forward when dragged far enough", () => {
    // Half of row 1 (50) plus all of row 2 (100) lands just short of row 3's own half.
    expect(dropIndex(uniform, 0, 201)).toBe(2)
    // Add row 3's half (50 more) and it crosses that one too.
    expect(dropIndex(uniform, 0, 251)).toBe(3)
  })

  it("crosses backward the same way", () => {
    expect(dropIndex(uniform, 3, -51)).toBe(2)
    expect(dropIndex(uniform, 3, -201)).toBe(1)
    expect(dropIndex(uniform, 3, -251)).toBe(0)
  })

  it("clamps at the last index rather than going out of bounds", () => {
    expect(dropIndex(uniform, 0, 100000)).toBe(uniform.length - 1)
  })

  it("clamps at the first index rather than going negative", () => {
    expect(dropIndex(uniform, 3, -100000)).toBe(0)
  })

  it("accounts for mixed row heights rather than assuming a uniform one", () => {
    // Row 0 short, row 1 tall (a two-line title), row 2 short.
    const mixed = [40, 160, 40]
    // Half of row 1's span (160/2 = 80) has to be crossed before landing on it.
    expect(dropIndex(mixed, 0, 79)).toBe(0)
    expect(dropIndex(mixed, 0, 81)).toBe(1)
  })

  it("adds the gap between rows to the threshold when one is given", () => {
    expect(dropIndex(uniform, 0, 54, 10)).toBe(0) // half of (100 + 10) = 55, not yet crossed
    expect(dropIndex(uniform, 0, 55, 10)).toBe(1)
  })

  it("returns the source index for an empty heights list", () => {
    expect(dropIndex([], 0, 500)).toBe(0)
  })

  it("clamps an out-of-range source index before computing", () => {
    expect(dropIndex(uniform, 10, 0)).toBe(uniform.length - 1)
  })
})

describe("siblingShifts", () => {
  const heights = [50, 60, 70, 80]

  it("returns all zeros when the source and target are the same", () => {
    expect(siblingShifts(heights, 1, 1)).toEqual([0, 0, 0, 0])
  })

  it("shifts only the rows strictly between source and target back, dragging forward", () => {
    // Dragging row 0 (height 50) down to index 2: rows 1 and 2 shift up by the dragged span.
    expect(siblingShifts(heights, 0, 2)).toEqual([0, -50, -50, 0])
  })

  it("shifts only the rows between target and source forward, dragging backward", () => {
    // Dragging row 3 (height 80) up to index 1: rows 1 and 2 shift down by the dragged span.
    expect(siblingShifts(heights, 3, 1)).toEqual([0, 80, 80, 0])
  })

  it("includes the gap between rows in the shift when one is given", () => {
    expect(siblingShifts(heights, 0, 1, 10)).toEqual([0, -60, 0, 0])
  })

  it("returns all zeros for an out-of-range source index", () => {
    expect(siblingShifts(heights, -1, 2)).toEqual([0, 0, 0, 0])
    expect(siblingShifts(heights, 10, 2)).toEqual([0, 0, 0, 0])
  })
})
