import { useCallback, useMemo } from "react"
import Animated, {
  AnimatedRef,
  measure,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useFrameCallback,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated"

/**
 * How close to the scroll view's visible top or bottom edge the finger has to get before the
 * list starts scrolling itself. Roughly two thirds of a stop card, so the zone is easy to reach
 * without swallowing rows you might still want to drop onto.
 */
const EDGE_ZONE = 80
/** Top speed, reached only right at the edge — it ramps up linearly across the zone. */
const MAX_SPEED_PER_SECOND = 600

export type DragAutoScrollRef = AnimatedRef<Animated.ScrollView>

export interface DragAutoScroll {
  /**
   * How far the container has scrolled itself since the current drag began. The drag adds it to
   * the gesture's own translation, so the dragged row keeps tracking the finger and the drop
   * index is measured against where each row's slot has moved to.
   */
  offset: SharedValue<number>
  /** Window-space Y of the finger, written by the drag gesture on every update. */
  fingerY: SharedValue<number>
  start: () => void
  stop: () => void
}

/**
 * Nudge-scrolls a scroll view while a drag is held near its top or bottom edge, the way
 * react-native-drax does — except driven by a Reanimated frame callback rather than a JS
 * interval, so the list keeps moving with the finger perfectly still and without touching the
 * JS thread mid-drag.
 *
 * Attach `scrollRef` and `onContentSizeChange` to the scroll view and hand `dragAutoScroll` to
 * whatever owns the drag gesture. One of these covers a whole screen: every section shares the
 * outer scroll view, and only one row can be dragged at a time.
 */
export const useDragAutoScroll = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollViewOffset(scrollRef)
  const contentHeight = useSharedValue(0)
  /** Where we have asked the scroll view to be — tracked apart from `scrollOffset` so a frame's
   *  nudge doesn't have to wait for the scroll event it causes to come back around. */
  const targetOffset = useSharedValue(0)
  const offset = useSharedValue(0)
  const fingerY = useSharedValue(0)

  const frameCallback = useFrameCallback((frame) => {
    const bounds = measure(scrollRef)
    const elapsed = frame.timeSincePreviousFrame

    if (!bounds || !elapsed) return

    const y = fingerY.get()
    const fromTop = y - bounds.pageY
    const fromBottom = bounds.pageY + bounds.height - y

    let direction = 0
    let intensity = 0

    if (fromTop < EDGE_ZONE) {
      direction = -1
      intensity = (EDGE_ZONE - fromTop) / EDGE_ZONE
    } else if (fromBottom < EDGE_ZONE) {
      direction = 1
      intensity = (EDGE_ZONE - fromBottom) / EDGE_ZONE
    }

    if (direction === 0) return

    const speed = Math.min(Math.max(intensity, 0), 1) * MAX_SPEED_PER_SECOND
    const furthest = Math.max(contentHeight.get() - bounds.height, 0)
    const current = targetOffset.get()
    const next = Math.min(Math.max(current + direction * speed * (elapsed / 1000), 0), furthest)

    if (next === current) return

    targetOffset.set(next)
    offset.set(offset.get() + (next - current))
    scrollTo(scrollRef, 0, next, false)
  }, false)

  const start = useCallback(() => {
    offset.set(0)
    targetOffset.set(scrollOffset.get())
    frameCallback.setActive(true)
  }, [frameCallback, offset, scrollOffset, targetOffset])

  const stop = useCallback(() => {
    frameCallback.setActive(false)
  }, [frameCallback])

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      contentHeight.set(height)
    },
    [contentHeight]
  )

  // Stable, since the drag gesture captures it inside a worklet.
  const dragAutoScroll: DragAutoScroll = useMemo(
    () => ({ offset, fingerY, start, stop }),
    [offset, fingerY, start, stop]
  )

  return { scrollRef, onContentSizeChange, dragAutoScroll }
}
