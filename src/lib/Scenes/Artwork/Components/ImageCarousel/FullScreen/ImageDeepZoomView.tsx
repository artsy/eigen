import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { debounce, throttle } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, View } from "react-native"
import { ImageDescriptor } from "../ImageCarouselContext"
import { useSpringValue } from "../useSpringValue"
import { screenBoundingBox, screenWidth } from "./screen"
import { EventStream, useEvents } from "./useEventStream"

const VISUAL_DEBUG = false

class TileID {
  static _cache = {}
  static create(level: number, row: number, col: number) {
    return new TileID(level, row, col).intern()
  }
  id: string | null = null
  private constructor(public readonly level: number, public readonly row: number, public readonly col: number) {}
  toString() {
    if (this.id !== null) {
      return this.id
    }
    this.id = `${this.level}:${this.row}:${this.col}`
    return this.id
  }
  private intern() {
    const result = TileID._cache[this.toString()]
    if (result) {
      return result
    }
    TileID._cache[this.toString()] = this
    return this
  }
}

class Pyramid {
  tileIDs: TileID[] = []
  currentTiles: { [id: string]: { loaded: boolean; onShouldLoad: null | (() => void) } } = {}
  getTile(id: TileID) {
    return this.currentTiles[id.toString()]
  }
  willMount({ id }: { id: TileID }) {
    this.tileIDs.push(id)
    this.currentTiles[id.toString()] = { loaded: false, onShouldLoad: null }
  }
  didMount({ id, onShouldLoad }: { id: TileID; onShouldLoad: () => void }) {
    this.currentTiles[id.toString()].onShouldLoad = onShouldLoad
    this.update()
  }
  didUnmount({ id }: { id: TileID }) {
    delete this.currentTiles[id.toString()]
    this.tileIDs.splice(this.tileIDs.indexOf(id), 1)
    this.update()
  }
  didLoad({ id }: { id: TileID }) {
    this.currentTiles[id.toString()].loaded = true
    this.update()
  }
  isTileFinishedLoading(id: TileID) {
    const current = this.currentTiles[id.toString()]
    if (!current) {
      // this tile is not being shown so yes it kinda has finished
      return true
    }
    return current.loaded
  }
  areTilesDirectlyAboveFinishedLoading(id: TileID) {
    // a tile above is considered loaded if it is not being shown or it is and has loaded

    // but also if a tile is not being shown than no tiles above are being shown either and it has kinda finished
    if (!this.currentTiles[id.toString()]) {
      return true
    }

    // this tile is being shown and it has loaded so check tiles above
    const levelUp = id.level + 1
    const firstRow = id.row * 2
    const firstCol = id.col * 2

    const topLeftKey = TileID.create(levelUp, firstRow, firstCol)
    const topRightKey = TileID.create(levelUp, firstRow, firstCol + 1)
    const bottomLeftKey = TileID.create(levelUp, firstRow + 1, firstCol)
    const bottomRightKey = TileID.create(levelUp, firstRow + 1, firstCol + 1)

    return (
      this.isTileFinishedLoading(topLeftKey) &&
      this.isTileFinishedLoading(topRightKey) &&
      this.isTileFinishedLoading(bottomLeftKey) &&
      this.isTileFinishedLoading(bottomRightKey)
    )
  }

  triggerLoad(id: TileID) {
    const record = this.getTile(id)
    if (record) {
      if (record.loaded) {
        this.triggerLoad(TileID.create(id.level - 1, Math.floor(id.row / 2), Math.floor(id.col / 2)))
      } else if (record.onShouldLoad && this.areTilesDirectlyAboveFinishedLoading(id)) {
        record.onShouldLoad()
        record.onShouldLoad = null
      }
    }
  }

  private _update() {
    for (const id of this.tileIDs) {
      this.triggerLoad(id)
    }
  }

  // tslint:disable-next-line:member-ordering
  update = debounce(this._update.bind(this), 16, { trailing: true })
}

interface TileProps {
  url: string
  top: number
  left: number
  width: number
  height: number
  id: TileID
  pyramid: Pyramid
}

const Tile: React.FC<TileProps> = ({ url, top, left, width, height, id, pyramid }) => {
  const [showing, setShowing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const isMounted = useIsMounted()
  const onLoad = useCallback(() => {
    if (!isMounted()) {
      return
    }
    setLoaded(true)
    pyramid.didLoad({ id })
  }, [])

  // register with pyramid during first render
  useMemo(() => {
    pyramid.willMount({ id })
  }, [])

  // wait for tiles above this one to load before this one
  useEffect(() => {
    pyramid.didMount({
      id,
      onShouldLoad() {
        setShowing(true)
      },
    })
    return () => {
      pyramid.didUnmount({ id })
    }
  }, [])

  const opacity = VISUAL_DEBUG ? 1 : useSpringValue(loaded ? 1 : 0)

  top = VISUAL_DEBUG ? top + height * 0.05 : top
  left = VISUAL_DEBUG ? left + width * 0.05 : left
  width = VISUAL_DEBUG ? width * 0.9 : width
  height = VISUAL_DEBUG ? height * 0.9 : height
  const backgroundColor = VISUAL_DEBUG
    ? !showing
      ? "rgba(255, 0, 0, 0.2)"
      : !loaded
        ? "rgba(0, 0, 255, 0.2)"
        : "rgba(0, 255, 0, 0.2)"
    : null
  if (VISUAL_DEBUG) {
    useEffect(
      () => {
        if (showing) {
          setTimeout(onLoad, 400)
        }
      },
      [showing]
    )
  }
  return !VISUAL_DEBUG && !showing ? null : (
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
          onLoad={onLoad}
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

interface ZoomScaleBoundaries {
  startZoomScale: number
  stopZoomScale: number
}
export const getZoomScaleBoundaries = ({
  levels,
  imageFittedWithinScreen,
}: {
  levels: Box[]
  imageFittedWithinScreen: Box
}) => {
  const result: ZoomScaleBoundaries[] = []
  for (const level of levels) {
    const perfectZoomScale = level.width / imageFittedWithinScreen.width
    const startZoomScale = perfectZoomScale / 2
    const stopZoomScale = perfectZoomScale * 4
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
  const pyramid = useMemo(() => new Pyramid(), [])
  useEffect(() => {
    triggerScrollEvent()
  }, [])

  // setup geometry
  const levels = useMemo(() => calculateDeepZoomLevels(Size), [Size])
  const imageFittedWithinScreen = useMemo(() => ({ width, height }), [width, height])
  const zoomScaleBoundaries = useMemo(() => getZoomScaleBoundaries({ imageFittedWithinScreen, levels }), [
    levels,
    imageFittedWithinScreen,
  ])
  const { minLevel, maxLevel } = useMemo(() => calculateMinMaxDeepZoomLevels({ width, height }, levels), [
    width,
    height,
    levels,
  ])

  const levelElements = useMemo(
    () => {
      const result: JSX.Element[] = []
      for (let level = minLevel; level <= maxLevel; level++) {
        result.push(
          <Level
            level={level}
            zoomScaleBoundaries={zoomScaleBoundaries[level]}
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
            pyramid={pyramid}
          />
        )
      }
      return result
    },
    [minLevel, maxLevel, levels, imageFittedWithinScreen]
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
  zoomScaleBoundaries: ZoomScaleBoundaries
  imageFittedWithinScreen: Box
  pyramid: Pyramid
  $contentOffsetX: Animated.Animated
  $contentOffsetY: Animated.Animated
  $zoomScale: Animated.Animated
  tileSize: number
  makeUrl: (props: { row: number; col: number }) => string
  viewPortChanges: EventStream<Rect>
  triggerScrollEvent(): void
}> = ({
  level,
  zoomScaleBoundaries,
  levelDimensions,
  imageFittedWithinScreen,
  pyramid,
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
    const zoomScale = screenWidth / viewPort.width

    if (zoomScale < zoomScaleBoundaries.startZoomScale || zoomScale > zoomScaleBoundaries.stopZoomScale) {
      setTiles(arr => {
        if (arr && arr.length === 0) {
          return arr
        }
        return []
      })
      lastFingerprint.current = ""
      return
    }

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
            <Tile
              id={TileID.create(level, row, col)}
              pyramid={pyramid}
              key={url}
              url={url}
              top={tileTop}
              left={tileLeft}
              width={tileWidth}
              height={tileHeight}
            />
          )
        }
        result.push(tileCache[url])
      }
    }
    setTiles(result)
  }, [])

  const throttledUpdateTiles = useMemo(() => throttle(updateTiles, 100, { trailing: true }), [])

  useEvents(viewPortChanges, throttledUpdateTiles)

  useEffect(() => {
    triggerScrollEvent()
  }, [])

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

function useIsMounted() {
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  return () => isMounted.current
}
