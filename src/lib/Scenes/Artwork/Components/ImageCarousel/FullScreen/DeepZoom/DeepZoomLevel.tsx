import { throttle } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated } from "react-native"
import { Rect, Size } from "../../geometry"
import { screenWidth } from "../screen"
import { EventStream, useEvents } from "../useEventStream"
import { VISUAL_DEBUG_MODE } from "./__deepZoomDebug"
import { getVisibleRowsAndColumns, ZoomScaleBoundaries } from "./deepZoomGeometry"
import { DeepZoomPyramid } from "./DeepZoomPyramid"
import { DeepZoomTile, DeepZoomTileID } from "./DeepZoomTile"

export const DeepZoomLevel: React.FC<{
  level: number
  levelDimensions: Size
  zoomScaleBoundaries: ZoomScaleBoundaries
  imageFittedWithinScreen: Size
  pyramid: DeepZoomPyramid
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
      const zoomScale = VISUAL_DEBUG_MODE ? 1 : $zoomScale
      const contentOffsetY = VISUAL_DEBUG_MODE ? 0 : $contentOffsetY
      const contentOffsetX = VISUAL_DEBUG_MODE ? 0 : $contentOffsetX

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

    if (zoomScale < zoomScaleBoundaries.startZoomScale) {
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
            <DeepZoomTile
              id={DeepZoomTileID.create(level, row, col)}
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
