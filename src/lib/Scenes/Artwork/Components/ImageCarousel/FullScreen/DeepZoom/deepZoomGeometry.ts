import { Rect, Size } from "../../geometry"
import { ImageDescriptor } from "../../ImageCarouselContext"

type DeepZoomImageSize = ImageDescriptor["deepZoom"]["Image"]["Size"]

/**
 * The way that deep zoom images are created is by halving the original image
 * dimensions (rounding up to the nearest pixel at each step) recursively
 * until you get to 1px * 1px
 */
export const calculateDeepZoomLevels = ({ Width, Height }: DeepZoomImageSize) => {
  const result: Size[] = [{ width: Width, height: Height }]
  let w = Width
  let h = Height
  while (w !== 1 || h !== 1) {
    w = Math.ceil(w / 2)
    h = Math.ceil(h / 2)
    result.push({ width: w, height: h })
  }
  return result.reverse()
}

/**
 * calculates the max ScrollView.zoomScale for this image
 */
export const calculateMaxZoomViewScale = (imageFittedWithinScreen: Size, fullResolutionImage: DeepZoomImageSize) => {
  return fullResolutionImage.Height / imageFittedWithinScreen.height
}

// zoom levels are in ascending order of size
export const calculateMinMaxDeepZoomLevels = (imageFittedWithinScreen: Size, zoomLevels: Size[]) => {
  let minLevel = 0
  const maxLevel = zoomLevels.length - 1
  for (const { width } of zoomLevels) {
    if (width >= imageFittedWithinScreen.width) {
      break
    }
    minLevel++
  }
  return { minLevel, maxLevel }
}

export interface ZoomScaleBoundaries {
  startZoomScale: number
  stopZoomScale: number
}
export const getZoomScaleBoundaries = ({
  levels,
  imageFittedWithinScreen,
}: {
  levels: Size[]
  imageFittedWithinScreen: Size
}) => {
  const result: ZoomScaleBoundaries[] = []
  for (const level of levels) {
    const perfectZoomScale = level.width / imageFittedWithinScreen.width
    const startZoomScale = perfectZoomScale / 2
    const stopZoomScale = perfectZoomScale * 8
    result.push({ startZoomScale, stopZoomScale })
  }
  return result
}

export function getVisibleRowsAndColumns({
  imageFittedWithinScreen: { width, height },
  levelDimensions,
  tileSize,
  viewPort,
  grow,
}: {
  levelDimensions: Size
  imageFittedWithinScreen: Size
  tileSize: number
  viewPort: Rect
  grow: number
}) {
  const scale = levelDimensions.width / width
  tileSize = tileSize / scale
  const numCols = Math.ceil(width / tileSize)
  const numRows = Math.ceil(height / tileSize)
  const minCol = Math.max(0, Math.floor(viewPort.x / tileSize) - grow)
  const minRow = Math.max(0, Math.floor(viewPort.y / tileSize) - grow)
  const maxCol = Math.min(numCols - 1, Math.floor((viewPort.x + viewPort.width) / tileSize) + grow)
  const maxRow = Math.min(numRows - 1, Math.floor((viewPort.y + viewPort.height) / tileSize) + grow)
  return { minRow, minCol, maxRow, maxCol, numCols, numRows }
}
