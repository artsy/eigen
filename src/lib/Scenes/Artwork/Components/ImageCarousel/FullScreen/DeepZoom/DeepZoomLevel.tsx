import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { throttle } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated } from "react-native"
import { Rect, Size } from "../../geometry"
import { EventStream, useEvents } from "../useEventStream"
import { VISUAL_DEBUG_MODE } from "./__deepZoomDebug"
import { getVisibleRowsAndColumns, ZoomScaleBoundaries } from "./deepZoomGeometry"
import { DeepZoomPyramid } from "./DeepZoomPyramid"
import { DeepZoomTile, DeepZoomTileID } from "./DeepZoomTile"

/**
 * DeepZoomLevel is responsible for showing one layer of tile images at a particular resolution.
 * It scales and translates the tiles in accordance with the zoomScale + contentOffset properties of the
 * controlling scroll view. In addition it uses the position of the view port to decide which rows and columns
 * to show at a given point in time.
 */
export const DeepZoomLevel: React.FC<{
  $contentOffsetX: Animated.Animated
  $contentOffsetY: Animated.Animated
  $zoomScale: Animated.Animated
  imageFittedWithinScreen: Size & { marginHorizontal: number; marginVertical: number }
  level: number
  levelDimensions: Size
  makeUrl: (props: { row: number; col: number }) => string
  pyramid: DeepZoomPyramid
  tileSize: number
  viewPortChanges: EventStream<Rect>
  zoomScaleBoundaries: ZoomScaleBoundaries
  triggerScrollEvent(): void
}> = ({
  $contentOffsetX,
  $contentOffsetY,
  $zoomScale,
  imageFittedWithinScreen,
  level,
  levelDimensions,
  makeUrl,
  pyramid,
  tileSize,
  viewPortChanges,
  zoomScaleBoundaries,
  triggerScrollEvent,
}) => {
  // Store the rendered JSX for the tiles in state, so that we can be very selective about when to trigger
  // re-rendering
  const [tiles, setTiles] = useState<JSX.Element[]>()

  // This is a tiny perf thing, but to help the react reconciler do less work, we cache the shallow JSX
  // for each tile
  const tileCache: { [url: string]: JSX.Element } = useMemo(() => ({}), [])

  // We use a 'fingerprint' of which rows and columns are currently being shown to decide whether to update
  // the `tiles` state.
  const lastFingerprint = useRef("")

  // Here we calculate the transform for the whole level. It's a hariy one, pay attention
  const transform = useMemo(
    () => {
      // in debug mode we ignore the controlling ScrollView so that it doesn't zoom or pan and you can see the whole pyramid at a glance
      const zoomScale = VISUAL_DEBUG_MODE ? 1 : $zoomScale
      const contentOffsetY = VISUAL_DEBUG_MODE ? -imageFittedWithinScreen.marginVertical : $contentOffsetY
      const contentOffsetX = VISUAL_DEBUG_MODE ? -imageFittedWithinScreen.marginHorizontal : $contentOffsetX

      // the first thing we want to do is place this level directly over the place where the base
      // image in the scroll view is (so, centered on screen when zoomScale === 1)
      // Most often this image is much bigger than the base image so it probably looks like this
      // to begin with:

      // +---------------+
      // |--------------------------------------------+
      // ||              |                            |
      // ||              |                            |
      // ||              |                            |
      // ||              |                            |
      // ||              |                            |
      // ||              |         this level         |
      // ||              |                            |
      // ||              |                            |
      // ||              |                            |
      // ||              |                            |
      // +--------------------------------------------+
      // |               |
      // |               |
      // | phone screen  |
      // |               |
      // +---------------+

      // but we want it to be like this

      // +---------------+
      // |               |
      // |               |
      // |               |
      // |               |
      // |               |
      // +---------------+
      // ||             ||
      // ||  this level ||
      // ||             ||
      // +---------------+
      // |               |
      // |               |
      // |               |
      // | phone screen  |
      // |               |
      // +---------------+

      // and it turns out the easiest way to do that is by centering the original-sized image over
      // the place where it's meant to be, before scaling it down.

      // like this

      //           +--------------+
      //           |              |
      //           |              |
      // +----------------------------------+
      // |         |              |         |
      // |         |              |         |
      // |         |              |         |
      // |         |              |         |
      // |         |              |         |
      // |         |              |         |
      // |         |  this level  |         |
      // |         |              |         |
      // |         |              |         |
      // |         |              |         |
      // +----------------------------------+
      //           |              |
      //           | phone screen |
      //           +--------------+

      // so we do that by finding out where the top of the base image is
      // (remember the base image is rendered inside the scroll view so it's being zoomed and
      // panned and everything)
      const baseImageTop = Animated.multiply(contentOffsetY, -1)
      // and then we find it's center Y position
      const baseImageHeight = Animated.multiply(imageFittedWithinScreen.height, zoomScale)
      const baseImageCenterY = Animated.add(baseImageTop, Animated.divide(baseImageHeight, 2))
      // and then we subtract half of the level height from that to get the top position of the
      // level at full resolution
      const levelPreScaleTop = Animated.subtract(baseImageCenterY, levelDimensions.height / 2)

      // then we do the same thing with left + width
      const baseImageLeft = Animated.multiply(contentOffsetX, -1)
      const baseImageWidth = Animated.multiply(imageFittedWithinScreen.width, zoomScale)
      const baseImageCenterX = Animated.add(baseImageLeft, Animated.divide(baseImageWidth, 2))
      const levelPreScaleLeft = Animated.subtract(baseImageCenterX, levelDimensions.width / 2)

      // Then we need to find the scale to divide by
      const levelScale = levelDimensions.width / imageFittedWithinScreen.width
      // and then we want it to get bigger as the user zooms so we multiply that by the zoomScale
      const scale = Animated.divide(zoomScale, levelScale)

      return [
        // position centered over base image
        { translateX: levelPreScaleLeft },
        { translateY: levelPreScaleTop },
        // scale it down
        { scale },
      ]
    },
    [levelDimensions, $contentOffsetX, $contentOffsetY, $zoomScale, imageFittedWithinScreen]
  )

  const screenDimensions = useScreenDimensions()

  const updateTiles = useCallback((viewPort: Rect) => {
    // first check whether we should even be showing any tiles at all on this level
    const zoomScale = screenDimensions.width / viewPort.width
    // we'll show tiles as long as the zoomScale start boundary has been breached.
    // this means the resolution of the last set of images is starting to get low enough
    // that it makes sense to bring the next higher-resolution level in to play.
    // we're ignoring the end boundary for now because it doesn't seem to help perf
    if (zoomScale < zoomScaleBoundaries.startZoomScale) {
      setTiles(arr => {
        // if the array is already empty we want it to remain referentially identical so
        // react doesn't trigger a re-render.
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

    const fingerprint = `${minRow}:${minCol}:${maxRow}:${maxCol}`

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
          // the bottommost or rightmost tiles might not be exactly tileSize, so we need a special case
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

  // TODO: find a reliable way to throttle this based on whether or not react has finished reconciling.
  // React doesn't have a way to drop frames so if we limit this to 10fps but a frame takes a whole second
  // to reconcile for some reason, then there's a 9-frame backlag of useless frames to render
  // (the user was probably panning and zooming to a different place during that one second)
  // I tried a few ways of doing this with hooks but couldn't figure out something 100% reliable.
  const throttledUpdateTiles = useMemo(() => throttle(updateTiles, 100, { trailing: true }), [])

  useEvents(viewPortChanges, throttledUpdateTiles)

  // trigger a scroll event on mount to make sure the initial tiles (if any) are displayed
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
