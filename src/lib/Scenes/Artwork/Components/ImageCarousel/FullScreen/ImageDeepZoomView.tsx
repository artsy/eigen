import React, { useCallback, useImperativeHandle, useMemo, useState } from "react"
import { Animated, Image, View } from "react-native"
import { ImageDescriptor } from "../ImageCarouselContext"
import { screenBoundingBox } from "./screen"

interface Tile {
  setShowing: (showing: boolean) => void
  loaded: boolean
}
interface TileProps {
  url: string
  top: number
  left: number
  width: number
  height: number
  level: number
  color: string
}

const Tile: React.FC<TileProps> = ({ url, top, left, width, height, level, color }) => {
  const [showing, setShowing] = useState(true)
  const [loaded, setLoaded] = useState(false)
  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
      }}
    >
      {showing && (
        <Image
          onLoad={() => {
            setLoaded(true)
          }}
          source={{
            uri: url,
          }}
          style={{ width, height }}
        />
      )}
    </View>
  )
}

type DeepZoomImageSize = ImageDescriptor["deepZoom"]["Image"]["Size"]

/**
 * The way that deep zoom images are created is by halving the original image
 * dimensions (rounding up to the nearest pixel at each step) recursively
 * until you get to 1px * 1px
 */
export const calculateDeepZoomLevels = ({ Width, Height }: DeepZoomImageSize) => {
  const result: Box[] = []
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
export const calculateMaxZoomViewScale = (imageFittedWithinScreen: Box, fullResolutionImage: DeepZoomImageSize) => {
  return fullResolutionImage.Height / imageFittedWithinScreen.height
}

// zoom levels are in ascending order of size
export const calculateMinMaxDeepZoomLevels = (imageFittedWithinScreen: Box, zoomLevels: Box[]) => {
  let minLevel = 0
  const maxLevel = zoomLevels.length - 1
  for (const { width } of zoomLevels) {
    if (width > imageFittedWithinScreen.width) {
      break
    }
    minLevel++
  }
  return { minLevel, maxLevel }
}

/**
 *
 */
export const getMaxDeepZoomLevelForZoomViewScale = ({
  minLevel,
  maxLevel,
  zoomScale,
  maxZoomScale,
}: {
  minLevel: number
  maxLevel: number
  maxZoomScale: number
  zoomScale: number
}) => {
  // minZoomScale is always 1
  // so we basically want to interpolate zoomScale between [minLevel, maxLevel] based on [1, maxZoomScale]
  const t = (zoomScale - 1) / (maxZoomScale - 1)
  return Math.min(Math.round(minLevel + (maxLevel - minLevel) * t), maxLevel)
}

export function getVisibleRowsAndColumns({
  imageFittedWithinScreen,
  levelDimensions,
  tileSize,
  viewPort,
}: {
  levelDimensions: Box
  imageFittedWithinScreen: Box
  tileSize: number
  viewPort: Rect
}) {
  if (!imageFittedWithinScreen) {
    console.error("imageFittedWithinScreen")
  }
  if (!levelDimensions) {
    console.error("levelDimensions")
  }
  if (!tileSize) {
    console.error("tileSize")
  }
  if (!viewPort) {
    console.error("viewPort")
  }
  const scale = levelDimensions.width / imageFittedWithinScreen.width
  const numCols = Math.ceil(levelDimensions.width / tileSize)
  const numRows = Math.ceil(levelDimensions.height / tileSize)
  const minCol = Math.max(0, Math.floor((viewPort.x * scale) / tileSize))
  const minRow = Math.max(0, Math.floor((viewPort.y * scale) / tileSize))
  const maxCol = Math.min(numCols, Math.floor(((viewPort.x + viewPort.width) * scale) / tileSize))
  const maxRow = Math.min(numRows, Math.floor(((viewPort.y + viewPort.height) * scale) / tileSize))
  return { minRow, minCol, maxRow, maxCol, numCols, numRows }
}
export interface ImageDeepZoomViewProps {
  image: ImageDescriptor
  width: number
  height: number
  viewPort: Rect
  $zoomScale: Animated.Value
  $contentOffsetX: Animated.Value
  $contentOffsetY: Animated.Value
}

const colors = ["#FFA719", "#FFCC00", "#99CCFF", "#488CBA"]

export const ImageDeepZoomView: React.FC<ImageDeepZoomViewProps> = ({
  image: {
    deepZoom: {
      Image: { Format, Size, TileSize, Url },
    },
  },
  width,
  height,
  viewPort,
  $zoomScale,
  $contentOffsetX,
  $contentOffsetY,
}) => {
  // setup geometry
  const levels = useMemo(() => calculateDeepZoomLevels(Size), [Size])
  const { minLevel, maxLevel } = useMemo(() => calculateMinMaxDeepZoomLevels({ width, height }, levels), [
    width,
    height,
    levels,
  ])
  const zoomScale = width / viewPort.width
  const maxZoomScale = Size.Width / width
  const maxLevelToRender = getMaxDeepZoomLevelForZoomViewScale({ minLevel, maxLevel, zoomScale, maxZoomScale })

  console.log({ minLevel, maxLevel, maxLevelToRender, maxZoomScale, zoomScale, levels, TileSize, viewPort })

  // manage tile state
  // tiles is the list of JSX tiles. This is immutable for perf reasons
  const tiles: JSX.Element[] = useMemo(
    () => {
      const result: JSX.Element[] = []
      for (let level = maxLevelToRender; level <= maxLevelToRender; level++) {
        if (!levels[level]) {
          console.error("level", level, "/", levels.length)
        }
        const { minRow, minCol, maxRow, maxCol, numCols, numRows } = getVisibleRowsAndColumns({
          imageFittedWithinScreen: { width, height },
          levelDimensions: levels[level],
          tileSize: TileSize,
          viewPort,
        })

        const levelScale = levels[level].width / width
        const actualTileSize = TileSize / levelScale

        const levelTiles: JSX.Element[] = []
        console.log("doing rows and cols for level", level)
        for (let row = minRow; row <= maxRow; row++) {
          for (let col = minCol; col <= maxCol; col++) {
            const url = `${Url}${level}/${col}_${row}.${Format}`
            console.log({ url })
            const tileTop = row * actualTileSize
            const tileLeft = col * actualTileSize
            const tileWidth = col < numCols - 1 ? TileSize : levels[level].width % TileSize
            const tileHeight = row < numRows - 1 ? TileSize : levels[level].height % TileSize

            levelTiles.push(
              <Tile
                key={url}
                url={url}
                top={tileTop}
                left={tileLeft}
                width={tileWidth}
                height={tileHeight}
                level={level}
                color={colors[(minLevel - level) % colors.length]}
              />
            )
          }
        }

        result.push(
          <Animated.View
            key={`level-${level}`}
            style={{
              ...levels[level],
              transform: [
                {
                  translateX: $contentOffsetX.interpolate({
                    inputRange: [],
                    outputRange: [],
                  }),
                },
              ],
            }}
          >
            {levelTiles}
          </Animated.View>
        )
      }

      return result
    },
    [viewPort]
  )

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        ...screenBoundingBox,
        top: 0,
        left: 0,
        opacity: $zoomScale.interpolate({ inputRange: [1, 5], outputRange: [0, 0.1] }),
        backgroundColor: "red",
      }}
    />
  )
}

interface Box {
  readonly width: number
  readonly height: number
}

interface Rect extends Box {
  readonly x: number
  readonly y: number
}

interface TileDistanceRecord {
  // index into the original tiles/tileRefs arrays so we can grab a ref
  // and make the tile load
  readonly tileIndex: number
  // these change over time based on the view port
  distance: number
  visible: boolean
  // absolute positioning details
  readonly rect: Rect
}

function updateDistances(viewPort: Rect, tileLoadQueue: TileDistanceRecord[]) {
  const viewPortCenter = getCenter(viewPort)
  for (const tileProximityRecord of tileLoadQueue) {
    const tileCenter = getCenter(tileProximityRecord.rect)
    // my man pythagoras ◿
    tileProximityRecord.distance = Math.sqrt(
      Math.pow(tileCenter.x - viewPortCenter.x, 2) + Math.pow(tileCenter.y - viewPortCenter.y, 2)
    )
    tileProximityRecord.visible = rectanglesOverlap(viewPort, tileProximityRecord.rect)
  }
}

function tileDistanceRecordComparator(a: TileDistanceRecord, b: TileDistanceRecord) {
  return a.distance - b.distance
}

function rectanglesOverlap(a: Rect, b: Rect) {
  const bRight = b.x + b.width
  const aRight = a.x + a.width
  const bBottom = b.y + b.height
  const aBottom = a.y + a.height
  const horizontalOverlap = a.x < bRight && aRight > b.x
  const verticalOverlap = a.y < bBottom && aBottom > b.y
  return horizontalOverlap && verticalOverlap
}

function getCenter(rect: Rect) {
  const x = rect.x + rect.width / 2
  const y = rect.y + rect.height / 2
  return { x, y }
}
