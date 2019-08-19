import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { throttle } from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Animated, View } from "react-native"
import { ImageDescriptor } from "../ImageCarouselContext"
import { useSpringValue } from "../useSpringValue"
import { DJB2 } from "./djb2"
import { screenBoundingBox } from "./screen"
import { EventStream, useEvents } from "./useEventStream"

interface TileProps {
  url: string
  top: number
  left: number
  width: number
  height: number
  cacheRecord: { [url: string]: { cached: boolean; showing: boolean } }
}

const Tile: React.FC<TileProps> = ({ url, top, left, width, height, cacheRecord }) => {
  const [loaded, setLoaded] = useState(false)
  const opacity = useSpringValue(loaded ? 1 : 0)
  useEffect(() => {
    if (!cacheRecord[url]) {
      cacheRecord[url] = { cached: false, showing: false }
    }
    return () => {
      cacheRecord[url].showing = false
    }
  }, [])
  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        opacity,
      }}
    >
      <OpaqueImageView
        onLoad={() => {
          setLoaded(true)
          cacheRecord[url].cached = true
          cacheRecord[url].showing = true
        }}
        imageURL={url}
        noAnimation
        useRawURL
        style={{ width, height }}
        placeholderBackgroundColor="white"
      />
    </Animated.View>
  )
}

type DeepZoomImageSize = ImageDescriptor["deepZoom"]["Image"]["Size"]

/**
 * The way that deep zoom images are created is by halving the original image
 * dimensions (rounding up to the nearest pixel at each step) recursively
 * until you get to 1px * 1px
 */
export const calculateDeepZoomLevels = ({ Width, Height }: DeepZoomImageSize) => {
  const result: Box[] = [{ width: Width, height: Height }]
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
    if (width >= imageFittedWithinScreen.width) {
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
  zoomScale,
  minLevelWidth,
  minLevel,
}: {
  zoomScale: number
  minLevelWidth: number
  minLevel: number
}) => {
  let levelWidth = minLevelWidth
  let level = minLevel
  while (levelWidth < minLevelWidth * zoomScale) {
    levelWidth *= 2
    level++
  }
  return level
}

export function getVisibleRowsAndColumns({
  imageFittedWithinScreen: { width, height },
  levelDimensions,
  tileSize,
  viewPort,
  grow,
}: {
  levelDimensions: Box
  imageFittedWithinScreen: Box
  tileSize: number
  viewPort: Rect
  grow: number
}) {
  // TODO: only grow if it's close
  const scale = levelDimensions.width / width
  tileSize = tileSize / scale
  const numCols = Math.ceil(width / tileSize)
  const numRows = Math.ceil(height / tileSize)
  const minCol = Math.max(0, Math.floor(viewPort.x / tileSize) - grow)
  const minRow = Math.max(0, Math.floor(viewPort.y / tileSize) - grow)
  const maxCol = Math.min(numCols, Math.floor((viewPort.x + viewPort.width) / tileSize) + grow)
  const maxRow = Math.min(numRows, Math.floor((viewPort.y + viewPort.height) / tileSize) + grow)
  return { minRow, minCol, maxRow, maxCol, numCols, numRows }
}
export interface ImageDeepZoomViewProps {
  image: ImageDescriptor
  width: number
  height: number
  viewPortChanges: EventStream<Rect>
  $zoomScale: Animated.Value
  $contentOffsetX: Animated.Value
  $contentOffsetY: Animated.Value
  didMount(): void
}

export const ImageDeepZoomView: React.FC<ImageDeepZoomViewProps> = ({
  image: {
    deepZoom: {
      Image: { Format, Size, TileSize, Url },
    },
  },
  width,
  height,
  viewPortChanges,
  $zoomScale,
  $contentOffsetX,
  $contentOffsetY,
  didMount,
}) => {
  // usePerf()
  const isUpToDate = useRef(false)
  const needsUpdate = useRef(false)
  isUpToDate.current = false
  useEffect(() => {
    if (needsUpdate.current) {
      setTimeout(() => {
        isUpToDate.current = true
        needsUpdate.current = false
        didMount()
      }, 30)
    } else {
      isUpToDate.current = true
    }
  })
  const cacheRecord = useMemo(() => ({}), [])
  const tileCache = useMemo(() => ({}), [])
  useEffect(() => {
    // trigger first scroll event
    didMount()
  }, [])
  // setup geometry
  const levels = useMemo(() => calculateDeepZoomLevels(Size), [Size])
  const { minLevel, maxLevel } = useMemo(() => calculateMinMaxDeepZoomLevels({ width, height }, levels), [
    width,
    height,
    levels,
  ])

  const lastTilesHashCode = useRef(0)
  const [tiles, setTiles] = useState([] as JSX.Element[])

  useEvents(
    viewPortChanges,
    throttle(
      viewPort => {
        if (!isUpToDate.current) {
          // don't do anything. wait for next update to complete and then schedule one more
          needsUpdate.current = true
          return
        }
        const zoomScale = width / viewPort.width
        const maxLevelToRender = Math.min(
          getMaxDeepZoomLevelForZoomViewScale({
            minLevel,
            minLevelWidth: levels[minLevel].width,
            zoomScale,
          }),
          maxLevel
        )
        const digest = new DJB2()

        for (let level = Math.max(minLevel, maxLevelToRender - 2); level <= maxLevelToRender; level++) {
          const { minRow, minCol, maxRow, maxCol } = getVisibleRowsAndColumns({
            imageFittedWithinScreen: { width, height },
            levelDimensions: levels[level],
            tileSize: TileSize,
            viewPort,
            grow: 1,
          })
          digest.include(level)
          digest.include(minRow)
          digest.include(minCol)
          digest.include(maxRow)
          digest.include(maxCol)
        }

        if (lastTilesHashCode.current === digest.hash) {
          return
        }

        lastTilesHashCode.current = digest.hash

        const result: JSX.Element[] = []

        for (let level = Math.max(minLevel, maxLevelToRender - 2); level <= maxLevelToRender; level++) {
          const { minRow, minCol, maxRow, maxCol, numCols, numRows } = getVisibleRowsAndColumns({
            imageFittedWithinScreen: { width, height },
            levelDimensions: levels[level],
            tileSize: TileSize,
            viewPort,
            grow: 1,
          })

          const levelTiles: JSX.Element[] = []

          for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
              const url = `${Url}${level}/${col}_${row}.${Format}`
              if (!tileCache[url]) {
                const tileTop = row * TileSize
                const tileLeft = col * TileSize
                const tileWidth = col < numCols - 1 ? TileSize : levels[level].width % TileSize
                const tileHeight = row < numRows - 1 ? TileSize : levels[level].height % TileSize

                tileCache[url] = (
                  <Tile
                    key={url}
                    url={url}
                    top={tileTop}
                    left={tileLeft}
                    width={tileWidth}
                    height={tileHeight}
                    cacheRecord={cacheRecord}
                  />
                )
              }
              levelTiles.push(tileCache[url])
            }
          }

          const levelScale = levels[level].width / width

          const $scale = Animated.divide($zoomScale, levelScale)
          const $baseImageTop = Animated.multiply($contentOffsetY, -1)
          const $baseImageHeight = Animated.multiply(height, $zoomScale)
          const $baseImageCenterY = Animated.add($baseImageTop, Animated.divide($baseImageHeight, 2))

          const $baseImageLeft = Animated.multiply($contentOffsetX, -1)
          const $baseImageWidth = Animated.multiply(width, $zoomScale)
          const $baseImageCenterX = Animated.add($baseImageLeft, Animated.divide($baseImageWidth, 2))

          const $levelPreScaleTop = Animated.subtract($baseImageCenterY, levels[level].height / 2)
          const $levelPreScaleLeft = Animated.subtract($baseImageCenterX, levels[level].width / 2)

          result.push(
            <Animated.View
              key={`level-${level}`}
              style={{
                position: "absolute",
                ...levels[level],
                transform: [
                  // position centered over base image
                  {
                    translateX: $levelPreScaleLeft,
                  },
                  {
                    translateY: $levelPreScaleTop,
                  },
                  // scale it down
                  {
                    scale: $scale,
                  },
                ],
              }}
            >
              {levelTiles}
            </Animated.View>
          )
        }

        setTiles(result)
      },
      250,
      { trailing: true }
    )
  )

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        ...screenBoundingBox,
        top: 0,
        left: 0,
      }}
    >
      {tiles}
    </View>
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
