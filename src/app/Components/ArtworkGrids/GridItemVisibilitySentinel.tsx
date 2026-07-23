import { FC, ReactNode, useCallback, useEffect, useRef } from "react"
import { Dimensions, View } from "react-native"

const POLL_INTERVAL = 1000

interface GridItemVisibilitySentinelProps {
  children?: ReactNode
  /** The value indicates the minimum percentage of the container that must be visible (vertically or horizontally). A value of 1 means 100%, 0.7 means 70%, and so forth. The default value is 1 (100%). */
  threshold?: number
  onVisibilityChange: (visible: boolean) => void
  /** Bump to force an immediate re-check of this item's current visibility, e.g. after a live refresh where an already-visible item wouldn't otherwise produce a transition. */
  refreshKey?: number
}

/**
 * Purpose-built alternative to the shared `Sentinel` for grid items that need repeatable
 * visibility detection (entering AND leaving the viewport, more than once per mount). `Sentinel`'s
 * own polling effect has an empty dependency array, so its internal comparison value freezes at
 * mount and it can only ever report one "true" transition for its entire lifetime — harmless for
 * its other, fire-once consumers elsewhere in the app, but not for a rail that live-refreshes and
 * needs to re-track items that are already on screen. Kept as a separate component so `Sentinel`
 * itself stays untouched for everyone else.
 */
export const GridItemVisibilitySentinel: FC<GridItemVisibilitySentinelProps> = ({
  children,
  threshold = 1,
  onVisibilityChange,
  refreshKey = 0,
}) => {
  const viewRef = useRef<View>(null)
  const isVisibleRef = useRef(false)

  // Read via a ref so the poll/refresh effects below (which only depend on `measure`) always call
  // the latest version, regardless of when their closures were created.
  const onVisibilityChangeRef = useRef(onVisibilityChange)
  onVisibilityChangeRef.current = onVisibilityChange

  const measure = useCallback(
    (report: (visible: boolean) => void) => {
      viewRef.current?.measure(
        (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
          const window = Dimensions.get("window")

          const isVisible =
            pageY + height != 0 &&
            pageY >= 0 &&
            pageY + height - height * (1 - threshold) <= window.height &&
            pageX + width > 0 &&
            pageX + width - width * (1 - threshold) <= window.width

          report(isVisible)
        }
      )
    },
    [threshold]
  )

  // Poll for visibility transitions, using a ref (not React state) as the comparison value so this
  // correctly detects repeated entering/leaving of the viewport rather than freezing after the
  // first transition.
  useEffect(() => {
    const interval = setInterval(() => {
      measure((visible) => {
        if (visible !== isVisibleRef.current) {
          isVisibleRef.current = visible
          onVisibilityChangeRef.current(visible)
        }
      })
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [measure])

  // On a live refresh, re-report current visibility even if it hasn't changed (an item that stays
  // on screen produces no transition for the poll above to catch).
  useEffect(() => {
    if (refreshKey === 0) {
      return
    }

    const raf = requestAnimationFrame(() => {
      measure((visible) => {
        isVisibleRef.current = visible
        onVisibilityChangeRef.current(visible)
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [refreshKey, measure])

  return (
    <View ref={viewRef} collapsable={false}>
      {children}
    </View>
  )
}
