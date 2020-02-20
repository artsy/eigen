import { PixelRatio } from "react-native"
import { Rect, Size } from "../../geometry"
import { ImageDescriptor } from "../../ImageCarouselContext"

type DeepZoomImageSize = ImageDescriptor["deepZoom"]["image"]["size"]

/**
 * The way that deep zoom images are created is by halving the original image
 * dimensions (rounding up to the nearest pixel at each step) recursively
 * until you get to 1px * 1px. This function does eactly that to the original image's dimensions.
 */
export const calculateDeepZoomLevels = ({ width, height }: DeepZoomImageSize) => {
  const result: Size[] = [{ width, height }]
  let w = width
  let h = height
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
  return fullResolutionImage.height / imageFittedWithinScreen.height
}

/**
 * A lot of zoom levels are useless because the resolution is lower than the screen size. Usually the first one we want
 * is around level 9. This function figures it out! I have a feeling this could be done with logarithms rather than a
 * for loop, but I forgot all the maths I ever learned about 5 years ago.
 */
export const calculateMinMaxDeepZoomLevels = (imageFittedWithinScreen: Size, zoomLevels: Size[]) => {
  let minLevel = 0
  const maxLevel = zoomLevels.length - 1
  for (const { width } of zoomLevels) {
    if (width >= imageFittedWithinScreen.width * PixelRatio.get()) {
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

/**
 * We want to know when to show a particular deep zoom level on screen. This calculates boundaries
 * for the scroll view's zoomScale property for that purpose.
 */
export const getZoomScaleBoundaries = ({
  levels,
  imageFittedWithinScreen,
}: {
  levels: Size[]
  imageFittedWithinScreen: Size
}) => {
  const result: ZoomScaleBoundaries[] = []
  for (const level of levels) {
    // This is the zoom scale at which the image will be at it's natural resolution
    const perfectZoomScale = level.width / (imageFittedWithinScreen.width * PixelRatio.get())
    const startZoomScale = perfectZoomScale / 2
    const stopZoomScale = perfectZoomScale * 8
    result.push({ startZoomScale, stopZoomScale })
  }
  return result
}

/**
 * This function decides which rows and columns to show of a particular zoom level
 */
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
