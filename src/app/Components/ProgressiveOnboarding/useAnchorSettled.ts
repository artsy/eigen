import { RefObject, useEffect, useRef, useState } from "react"
import { Dimensions, View } from "react-native"

/** How often the anchor is re-measured while we wait for it to stop moving. */
export const ANCHOR_SETTLE_INTERVAL_MS = 100

/**
 * Holds a requested popover back until its anchor has stopped moving, and is on screen.
 *
 * The popover library measures its anchor once, as it opens, and never again. If the
 * surface is still scrolling (a drag, or momentum after a fling) that snapshot is taken
 * mid-flight and the bubble lands above or below the anchor. Once the popover is up its
 * Modal swallows touches, so a position measured at rest stays correct.
 *
 * There is deliberately no timeout. Opening into a list that is still moving is what
 * leaves a Modal stuck: the anchor scrolls out of view mid-open, the popover is hidden
 * before it finishes measuring, and the watchdog has to tear the Modal down. Waiting costs
 * nothing, because no Modal exists yet and the coordinator's watchdog only starts once we
 * stop waiting.
 *
 * The on-screen check is a backstop for callers' own `isInView` conditions, which can go
 * stale (`Sentinel` never reports an anchor leaving the viewport). Without it, a popover
 * whose anchor has been scrolled away opens pinned to the screen edge, pointing at nothing.
 *
 * Hiding is never delayed.
 *
 * `resetKey` starts the wait over: changing it reports "not settled" until the anchor has
 * settled again. With `onOffScreen`, the wait stops and calls it instead of polling an anchor
 * that has left the screen, so the caller can give up whatever it holds while it waits.
 */
export const useAnchorSettled = (
  anchorRef: RefObject<View | null> | undefined,
  isRequested: boolean,
  { resetKey = 0, onOffScreen }: { resetKey?: number; onOffScreen?: () => void } = {}
) => {
  // The key we settled for, so a new key reads as "not settled" from its very first render.
  const [settledKey, setSettledKey] = useState<number | undefined>(undefined)
  const onOffScreenRef = useRef(onOffScreen)
  onOffScreenRef.current = onOffScreen

  useEffect(() => {
    if (!isRequested) {
      setSettledKey(undefined)
      return
    }

    let isCancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined
    let previous: { x: number; y: number } | undefined

    const measure = () => {
      const anchor = anchorRef?.current
      if (!anchor) {
        // Nothing to wait for: the library has its own wait for the anchor to mount.
        setSettledKey(resetKey)
        return
      }

      anchor.measureInWindow((x, y, width, height) => {
        if (isCancelled) {
          return
        }

        const hasStopped =
          !!previous && Math.abs(previous.x - x) < 1 && Math.abs(previous.y - y) < 1
        const window = Dimensions.get("window")
        // At least partly visible, rather than fully: on Android edge-to-edge the window can
        // exclude the navigation bar, so a tab bar anchor never fits inside it entirely.
        const isOnScreen = y + height > 0 && y < window.height && x + width > 0 && x < window.width
        if (hasStopped && isOnScreen) {
          setSettledKey(resetKey)
          return
        }
        if (!isOnScreen && onOffScreenRef.current) {
          onOffScreenRef.current()
          return
        }

        previous = { x, y }
        timeout = setTimeout(measure, ANCHOR_SETTLE_INTERVAL_MS)
      })
    }

    measure()

    return () => {
      isCancelled = true
      clearTimeout(timeout)
    }
  }, [anchorRef, isRequested, resetKey])

  return isRequested && settledKey === resetKey
}
