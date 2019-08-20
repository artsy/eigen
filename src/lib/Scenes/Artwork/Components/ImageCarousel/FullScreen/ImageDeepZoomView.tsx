import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { throttle } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, View } from "react-native"
import { ImageDescriptor } from "../ImageCarouselContext"
import { useSpringValue } from "../useSpringValue"
import { screenBoundingBox } from "./screen"
import { EventStream, useEvents } from "./useEventStream"

const VISUAL_DEBUG = false

interface TileProps {
  url: string
  top: number
  left: number
  width: number
  height: number
}

const Tile: React.FC<TileProps> = ({ url, top, left, width, height }) => {
  const [loaded, setLoaded] = useState(false)
  const opacity = VISUAL_DEBUG ? 1 : useSpringValue(loaded ? 1 : 0)
  top = VISUAL_DEBUG ? top + height * 0.05 : top
  left = VISUAL_DEBUG ? left + width * 0.05 : left
  width = VISUAL_DEBUG ? width * 0.9 : width
  height = VISUAL_DEBUG ? height * 0.9 : height
  const backgroundColor = VISUAL_DEBUG ? "rgba(255, 0, 0, 0.2)" : null
  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        opacity,
        backgroundColor,
      }}
    >
      {!VISUAL_DEBUG && (
        <OpaqueImageView
          onLoad={() => {
            setLoaded(true)
          }}
          imageURL={url}
          noAnimation
          useRawURL
          style={{ width, height }}
          placeholderBackgroundColor="white"
        />
      )}
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
export interface ImageDeepZoomViewProps {
  image: ImageDescriptor
  width: number
  height: number
  viewPortChanges: EventStream<Rect>
  $zoomScale: Animated.Value
  $contentOffsetX: Animated.Value
  $contentOffsetY: Animated.Value
  triggerScrollEvent(): void
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
  triggerScrollEvent,
}) => {
  // usePerf()
  useEffect(() => {
    triggerScrollEvent()
  }, [])
  // setup geometry
  const levels = useMemo(() => calculateDeepZoomLevels(Size), [Size])
  const { minLevel, maxLevel } = useMemo(() => calculateMinMaxDeepZoomLevels({ width, height }, levels), [
    width,
    height,
    levels,
  ])

  const [{ minLevelToRender, maxLevelToRender }, setRenderLevels] = useState({
    minLevelToRender: minLevel,
    maxLevelToRender: minLevel,
  })

  useEvents(
    viewPortChanges,
    useMemo(
      () =>
        throttle(
          viewPort => {
            const zoomScale = width / viewPort.width
            const max = Math.min(
              getMaxDeepZoomLevelForZoomViewScale({
                minLevel,
                minLevelWidth: levels[minLevel].width,
                zoomScale,
              }),
              maxLevel
            )
            setRenderLevels({ minLevelToRender: Math.max(minLevelToRender, max - 3), maxLevelToRender: max })
          },
          250,
          {
            trailing: true,
          }
        ),
      []
    )
  )

  const imageFittedWithinScreen = useMemo(() => ({ width, height }), [width, height])

  const levelElements = useMemo(
    () => {
      const result: JSX.Element[] = []
      for (let level = minLevelToRender; level <= maxLevelToRender; level++) {
        result.push(
          <Level
            level={level}
            levelDimensions={levels[level]}
            imageFittedWithinScreen={imageFittedWithinScreen}
            makeUrl={({ row, col }) => `${Url}${level}/${col}_${row}.${Format}`}
            $contentOffsetX={$contentOffsetX}
            $contentOffsetY={$contentOffsetY}
            $zoomScale={$zoomScale}
            tileSize={TileSize}
            viewPortChanges={viewPortChanges}
            triggerScrollEvent={triggerScrollEvent}
            key={level}
          />
        )
      }
      return result
    },
    [minLevelToRender, maxLevelToRender, levels, imageFittedWithinScreen]
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
      {levelElements}
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

const Level: React.FC<{
  level: number
  levelDimensions: Box
  imageFittedWithinScreen: Box
  $contentOffsetX: Animated.Animated
  $contentOffsetY: Animated.Animated
  $zoomScale: Animated.Animated
  tileSize: number
  makeUrl: (props: { row: number; col: number }) => string
  viewPortChanges: EventStream<Rect>
  triggerScrollEvent(): void
}> = ({
  levelDimensions,
  imageFittedWithinScreen,
  $contentOffsetX,
  $contentOffsetY,
  $zoomScale,
  tileSize,
  makeUrl,
  viewPortChanges,
  triggerScrollEvent,
}) => {
  const [tiles, setTiles] = useState()
  const tileCache: { [url: string]: JSX.Element } = useMemo(() => ({}), [])
  const lastFingerprint = useRef("")

  const transform = useMemo(
    () => {
      const zoomScale = VISUAL_DEBUG ? 1 : $zoomScale
      const contentOffsetY = VISUAL_DEBUG ? 0 : $contentOffsetY
      const contentOffsetX = VISUAL_DEBUG ? 0 : $contentOffsetX

      const levelScale = levelDimensions.width / imageFittedWithinScreen.width
      const scale = Animated.divide(zoomScale, levelScale)
      const baseImageTop = Animated.multiply(contentOffsetY, -1)
      const baseImageHeight = Animated.multiply(imageFittedWithinScreen.height, zoomScale)
      const baseImageCenterY = Animated.add(baseImageTop, Animated.divide(baseImageHeight, 2))

      const baseImageLeft = Animated.multiply(contentOffsetX, -1)
      const baseImageWidth = Animated.multiply(imageFittedWithinScreen.width, zoomScale)
      const baseImageCenterX = Animated.add(baseImageLeft, Animated.divide(baseImageWidth, 2))

      const levelPreScaleTop = Animated.subtract(baseImageCenterY, levelDimensions.height / 2)
      const levelPreScaleLeft = Animated.subtract(baseImageCenterX, levelDimensions.width / 2)

      return [
        // position centered over base image
        {
          translateX: levelPreScaleLeft,
        },
        {
          translateY: levelPreScaleTop,
        },
        // scale it down
        {
          scale,
        },
      ]
    },
    [levelDimensions, $contentOffsetX, $contentOffsetY, $zoomScale, imageFittedWithinScreen]
  )

  const updateTiles = useCallback((viewPort: Rect) => {
    const { minRow, minCol, maxRow, maxCol, numCols, numRows } = getVisibleRowsAndColumns({
      imageFittedWithinScreen,
      levelDimensions,
      tileSize,
      viewPort,
      grow: 1,
    })

    const fingerprint = `${minRow}:${minCol}:${maxRow}:${maxCol}:${numCols}:${numRows}`
    if (fingerprint === lastFingerprint.current) {
      return
    }

    lastFingerprint.current = fingerprint

    const result: JSX.Element[] = []

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const url = makeUrl({ col, row })
        if (!tileCache[url]) {
          const tileTop = row * tileSize
          const tileLeft = col * tileSize
          const tileWidth = col < numCols - 1 ? tileSize : levelDimensions.width % tileSize
          const tileHeight = row < numRows - 1 ? tileSize : levelDimensions.height % tileSize

          tileCache[url] = (
            <Tile key={url} url={url} top={tileTop} left={tileLeft} width={tileWidth} height={tileHeight} />
          )
        }
        result.push(tileCache[url])
      }
    }

    setTiles(result)
  }, [])

  const { isReconciled, onReconcile } = useReconciliationInfo()

  const throttledUpdateTiles = useCallback(
    throttle(
      (viewPort: Rect) => {
        if (isReconciled()) {
          updateTiles(viewPort)
        } else {
          onReconcile(triggerScrollEvent)
        }
      },
      250,
      { trailing: true }
    ),
    []
  )

  useEvents(viewPortChanges, throttledUpdateTiles)

  return (
    <Animated.View
      style={{
        position: "absolute",
        ...levelDimensions,
        transform,
      }}
    >
      {tiles}
    </Animated.View>
  )
}

function useReconciliationInfo() {
  const onReconcile = useRef(null as (() => any) | null)
  const isReconciled = useRef(false)
  // reset to false on every render
  isReconciled.current = false
  useEffect(() => {
    isReconciled.current = true
    if (onReconcile.current) {
      onReconcile.current()
      onReconcile.current = null
    }
  })
  const getIsReconciled = useCallback(() => isReconciled.current, [])
  const setOnReconcile = useCallback((cb: () => any) => (onReconcile.current = cb), [])
  return { isReconciled: getIsReconciled, onReconcile: setOnReconcile }
}
