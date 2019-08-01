import { getMaxDeepZoomLevelForZoomViewScale, getVisibleRowsAndColumns } from "../ImageDeepZoomView"

describe(getMaxDeepZoomLevelForZoomViewScale, () => {
  it("works", () => {
    expect(
      getMaxDeepZoomLevelForZoomViewScale({
        minLevel: 7,
        maxLevel: 12,
        maxZoomScale: 20,
        zoomScale: 1,
      })
    ).toBe(7)

    expect(
      getMaxDeepZoomLevelForZoomViewScale({
        minLevel: 7,
        maxLevel: 12,
        maxZoomScale: 20,
        zoomScale: 2,
      })
    ).toBe(7)

    expect(
      getMaxDeepZoomLevelForZoomViewScale({
        minLevel: 7,
        maxLevel: 12,
        maxZoomScale: 20,
        zoomScale: 3,
      })
    ).toBe(8)

    expect(
      getMaxDeepZoomLevelForZoomViewScale({
        minLevel: 7,
        maxLevel: 12,
        maxZoomScale: 20,
        zoomScale: 19,
      })
    ).toBe(12)

    expect(
      getMaxDeepZoomLevelForZoomViewScale({
        minLevel: 7,
        maxLevel: 12,
        maxZoomScale: 20,
        zoomScale: 20,
      })
    ).toBe(12)
  })
})

describe(getVisibleRowsAndColumns, () => {
  const decimalGrid = {
    imageFittedWithinScreen: { width: 100, height: 100 },
    levelDimensions: { width: 1000, height: 1000 },
    tileSize: 100,
  }
  it("works", () => {
    expect(
      getVisibleRowsAndColumns({
        ...decimalGrid,
        viewPort: { x: 25, y: 25, width: 50, height: 50 },
      })
    ).toEqual({
      minCol: 2,
      minRow: 2,
      maxCol: 7,
      maxRow: 7,
    })

    expect(
      getVisibleRowsAndColumns({
        ...decimalGrid,
        viewPort: { x: 0, y: 0, width: 50, height: 25 },
      })
    ).toEqual({
      minCol: 0,
      minRow: 0,
      maxCol: 5,
      maxRow: 2,
    })
    expect(
      getVisibleRowsAndColumns({
        ...decimalGrid,
        viewPort: { x: 0, y: 0, width: 50, height: 25 },
      })
    ).toEqual({
      minCol: 0,
      minRow: 0,
      maxCol: 5,
      maxRow: 2,
    })
  })
})
