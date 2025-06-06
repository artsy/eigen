import { getVisibleRowsAndColumns } from "app/Scenes/Artwork/Components/ImageCarousel/FullScreen/DeepZoom/deepZoomGeometry"

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
        grow: 0,
      })
    ).toEqual({
      minCol: 2,
      minRow: 2,
      maxCol: 7,
      maxRow: 7,
      numRows: 10,
      numCols: 10,
    })

    expect(
      getVisibleRowsAndColumns({
        ...decimalGrid,
        viewPort: { x: 0, y: 0, width: 50, height: 25 },
        grow: 0,
      })
    ).toEqual({
      minCol: 0,
      minRow: 0,
      maxCol: 5,
      maxRow: 2,
      numRows: 10,
      numCols: 10,
    })
    expect(
      getVisibleRowsAndColumns({
        ...decimalGrid,
        viewPort: { x: 0, y: 0, width: 50, height: 25 },
        grow: 0,
      })
    ).toEqual({
      minCol: 0,
      minRow: 0,
      maxCol: 5,
      maxRow: 2,
      numRows: 10,
      numCols: 10,
    })
  })
})
