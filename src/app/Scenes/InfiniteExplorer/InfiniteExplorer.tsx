import { Screen, useScreenDimensions } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { InfiniteExplorerColumn } from "app/Scenes/InfiniteExplorer/Components/InfiniteExplorerColumn"
import { InfiniteExplorerHeader } from "app/Scenes/InfiniteExplorer/Components/InfiniteExplorerHeader"
import {
  EXTRA_COLUMNS_PER_SIDE,
  TOTAL_COLUMN_COUNT,
  VISIBLE_COLUMN_COUNT,
  useMaxTileHeight,
} from "app/Scenes/InfiniteExplorer/hooks/useColumnLayout"
import { useCallback, useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

interface InfiniteExplorerProps {
  columns: InfiniteDiscoveryArtwork[][]
  columnWidth: number
  requestMoreForColumn: () => void
}

// Zooming out this far brings all TOTAL_COLUMN_COUNT columns into view at
// once (rather than stopping at the initial VISIBLE_COLUMN_COUNT fit), so
// pinch-zoom is a second way (besides panning) to reach the reserved side
// columns, as requested.
const MIN_SCALE = VISIBLE_COLUMN_COUNT / TOTAL_COLUMN_COUNT
const MAX_SCALE = 6
const FOCUS_SCALE = 2.5
const OPEN_BUTTON_ZOOM_THRESHOLD = 2
// How close a column's bottom edge needs to get to the bottom of the
// viewport (in screen points) before we ask for another page for it.
const PAGINATION_TRIGGER_MARGIN = 600

type Measurement = { x: number; y: number; width: number; height: number }

const measureView = (view: View) =>
  new Promise<Measurement | null>((resolve) => {
    view.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }))
  })

export const InfiniteExplorer: React.FC<InfiniteExplorerProps> = ({
  columns,
  columnWidth,
  requestMoreForColumn,
}) => {
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()
  const maxTileHeight = useMaxTileHeight()

  const [commitSeenArtworkMutation] = useCreateUserSeenArtwork()

  const canvasRef = useRef<View>(null)
  const tileRefsMap = useRef(new Map<string, View>())
  const columnRefsMap = useRef(new Map<number, View>())
  const seenArtworkIdsRef = useRef(new Set<string>())
  const requestedLengthPerColumnRef = useRef<number[]>([])

  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  // Columns start centered on the middle VISIBLE_COLUMN_COUNT slots, with
  // EXTRA_COLUMNS_PER_SIDE held in reserve off-screen on either side — shift
  // left by that many columns so the reserved ones start out of view.
  const initialTranslateX = -EXTRA_COLUMNS_PER_SIDE * columnWidth
  const translateX = useSharedValue(initialTranslateX)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(initialTranslateX)
  const savedTranslateY = useSharedValue(0)

  const [focusedArtworkId, setFocusedArtworkId] = useState<string | null>(
    () => columns.find((column) => column.length > 0)?.[0]?.internalID ?? null
  )
  const [isZoomedIn, setIsZoomedIn] = useState(false)

  useAnimatedReaction(
    () => scale.value > OPEN_BUTTON_ZOOM_THRESHOLD,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setIsZoomedIn)(current)
      }
    }
  )

  const markArtworkSeen = useCallback(
    (artworkId: string | null) => {
      if (!artworkId || seenArtworkIdsRef.current.has(artworkId)) {
        return
      }

      seenArtworkIdsRef.current.add(artworkId)

      commitSeenArtworkMutation({
        variables: { input: { artworkId } },
        onError: (error) => {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(`useCreateUserSeenArtwork ${error?.message}`)
          }
        },
      })
    },
    [commitSeenArtworkMutation]
  )

  useEffect(() => {
    markArtworkSeen(focusedArtworkId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const registerTileRef = useCallback((id: string, ref: View | null) => {
    if (ref) {
      tileRefsMap.current.set(id, ref)
    } else {
      tileRefsMap.current.delete(id)
    }
  }, [])

  const registerColumnRef = useCallback((columnIndex: number, ref: View | null) => {
    if (ref) {
      columnRefsMap.current.set(columnIndex, ref)
    } else {
      columnRefsMap.current.delete(columnIndex)
    }
  }, [])

  // Finds whichever currently-rendered tile's screen-space bounding box is
  // closest to the viewport center. Only called after a gesture settles (not
  // every frame), since it requires an async native measurement per tile.
  const recomputeFocusedTile = useCallback(async () => {
    const entries = Array.from(tileRefsMap.current.entries())
    const viewportCenter = { x: screenWidth / 2, y: screenHeight / 2 }

    const measurements = await Promise.all(
      entries.map(async ([id, ref]) => [id, await measureView(ref)] as const)
    )

    let closestId: string | null = null
    let closestDistance = Infinity

    measurements.forEach(([id, measurement]) => {
      if (!measurement) {
        return
      }

      const cx = measurement.x + measurement.width / 2
      const cy = measurement.y + measurement.height / 2
      const distance = Math.hypot(cx - viewportCenter.x, cy - viewportCenter.y)

      if (distance < closestDistance) {
        closestDistance = distance
        closestId = id
      }
    })

    if (closestId) {
      setFocusedArtworkId(closestId)
      markArtworkSeen(closestId)
    }
  }, [screenWidth, screenHeight, markArtworkSeen])

  // Measures each column's own bounding box (not its last tile) so this
  // works for the reserved side columns too — an empty column measures as
  // zero-height, which trivially satisfies "needs more" without any special
  // casing. Checks every column (not just the ones currently on screen) so
  // the reserved side columns keep accumulating content in the background —
  // by the time panning/zooming actually reaches one, there's already
  // something there instead of a blank wait.
  const checkPagination = useCallback(async () => {
    await Promise.all(
      columns.map(async (columnArtworks, columnIndex) => {
        const ref = columnRefsMap.current.get(columnIndex)

        if (!ref) {
          return
        }

        const measurement = await measureView(ref)

        if (!measurement) {
          return
        }

        const columnBottom = measurement.y + measurement.height
        const isNearBottom = columnBottom <= screenHeight + PAGINATION_TRIGGER_MARGIN

        if (isNearBottom && requestedLengthPerColumnRef.current[columnIndex] !== columnArtworks.length) {
          requestedLengthPerColumnRef.current[columnIndex] = columnArtworks.length
          requestMoreForColumn()
        }
      })
    )
  }, [columns, screenHeight, requestMoreForColumn])

  const handleGestureSettled = useCallback(() => {
    recomputeFocusedTile()
    checkPagination()
  }, [recomputeFocusedTile, checkPagination])

  // Also check right after mount and after every fetch resolves (not just
  // after a gesture) — the reused discoverArtworks query's server-side
  // default page size is small, so columns need several automatic fetches
  // back-to-back before there's enough content to fill the screen.
  useEffect(() => {
    checkPagination()
  }, [checkPagination])

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      const nextScale = savedScale.value * event.scale
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
    })
    .onEnd(() => {
      savedScale.value = scale.value
      runOnJS(handleGestureSettled)()
    })

  // Single finger (or more) drags the whole canvas around, 1:1 with the
  // finger. minDistance lets small taps on tiles/buttons fall through to
  // their own Touchables instead of being captured as a pan.
  const pan = Gesture.Pan()
    .minDistance(10)
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX
      translateY.value = savedTranslateY.value + event.translationY
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
      runOnJS(handleGestureSettled)()
    })

  const composedGesture = Gesture.Simultaneous(pinch, pan)

  // translateX/Y must come before scale in this array: RN applies transforms
  // right-to-left, so listing scale last means translate is added in fixed
  // screen points (matching the finger 1:1) and only the result gets scaled
  // around the canvas's own center. Reversing this order (scale before
  // translate) causes translate to be scaled too, which is what produced the
  // "tapped tile lands in a corner" bug.
  const canvasAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  // Centers the tapped tile at FOCUS_SCALE. Derived by measuring the tile's
  // current (already-transformed) screen position, then solving for the
  // translate that lands its center on the viewport center once scale
  // changes from the current value to FOCUS_SCALE. Scale always happens
  // around the canvas's own layout center, so that center's on-screen
  // position (measured now, minus the current translate) is the fixed point
  // the algebra pivots around.
  const handleFocusTile = useCallback(
    (artworkId: string) => {
      if (artworkId === focusedArtworkId) {
        return
      }

      const tileRef = tileRefsMap.current.get(artworkId)
      const canvas = canvasRef.current

      if (!tileRef || !canvas) {
        setFocusedArtworkId(artworkId)
        markArtworkSeen(artworkId)
        return
      }

      Promise.all([measureView(tileRef), measureView(canvas)]).then(
        ([tileMeasurement, canvasMeasurement]) => {
          if (!tileMeasurement || !canvasMeasurement) {
            setFocusedArtworkId(artworkId)
            markArtworkSeen(artworkId)
            return
          }

          const currentScale = scale.value
          const currentTranslate = { x: translateX.value, y: translateY.value }

          const tileScreenCenter = {
            x: tileMeasurement.x + tileMeasurement.width / 2,
            y: tileMeasurement.y + tileMeasurement.height / 2,
          }
          const canvasScreenCenter = {
            x: canvasMeasurement.x + canvasMeasurement.width / 2,
            y: canvasMeasurement.y + canvasMeasurement.height / 2,
          }

          const originCenter = {
            x: canvasScreenCenter.x - currentTranslate.x,
            y: canvasScreenCenter.y - currentTranslate.y,
          }

          const viewportCenter = { x: screenWidth / 2, y: screenHeight / 2 }
          const scaleRatio = FOCUS_SCALE / currentScale

          const newTranslateX =
            viewportCenter.x -
            originCenter.x -
            scaleRatio * (tileScreenCenter.x - currentTranslate.x - originCenter.x)
          const newTranslateY =
            viewportCenter.y -
            originCenter.y -
            scaleRatio * (tileScreenCenter.y - currentTranslate.y - originCenter.y)

          scale.value = withTiming(FOCUS_SCALE)
          savedScale.value = FOCUS_SCALE
          translateX.value = withTiming(newTranslateX)
          translateY.value = withTiming(newTranslateY)
          savedTranslateX.value = newTranslateX
          savedTranslateY.value = newTranslateY

          setFocusedArtworkId(artworkId)
          markArtworkSeen(artworkId)
        }
      )
    },
    [
      focusedArtworkId,
      screenWidth,
      screenHeight,
      scale,
      translateX,
      translateY,
      savedScale,
      savedTranslateX,
      savedTranslateY,
      markArtworkSeen,
    ]
  )

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth disableKeyboardAvoidance backgroundColor="mono100">
        <InfiniteExplorerHeader />
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            ref={canvasRef}
            style={[
              // alignItems: "flex-start" keeps each column sized to its own
              // content — the default "stretch" would force every column
              // (including the still-empty reserve ones) to match the
              // tallest sibling's height, which would break the
              // column-height-based pagination check above.
              { flex: 1, flexDirection: "row", alignItems: "flex-start", backgroundColor: "black" },
              canvasAnimatedStyle,
            ]}
          >
            {columns.map((columnArtworks, index) => (
              <InfiniteExplorerColumn
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                artworks={columnArtworks}
                columnRef={(ref) => registerColumnRef(index, ref)}
                columnWidth={columnWidth}
                maxTileHeight={maxTileHeight}
                focusedArtworkId={focusedArtworkId}
                isZoomedIn={isZoomedIn}
                onFocusTile={handleFocusTile}
                registerTileRef={registerTileRef}
              />
            ))}
          </Animated.View>
        </GestureDetector>
      </Screen.Body>
    </Screen>
  )
}
