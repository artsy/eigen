import { useIsFocused } from "@react-navigation/native"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { RefObject, useCallback, useEffect, useRef } from "react"
import { Dimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const POLL_INTERVAL = 1000

interface UseGridItemVisibilityArgs {
  ref: RefObject<View | null>
  /** The value indicates the minimum percentage of the container that must be visible (vertically or horizontally). A value of 1 means 100%, 0.7 means 70%, and so forth. The default value is 1 (100%). */
  threshold?: number
  enabled: boolean
  onVisibilityChange: (visible: boolean) => void
}

/**
 * Purpose-built alternative to the shared `Sentinel` for grid items that need repeatable
 * visibility detection. `Sentinel`'s own polling effect has an empty dependency array, so its
 * internal comparison value freezes at mount and it can only ever report one "true" transition for
 * its entire lifetime — harmless for its other, fire-once consumers elsewhere in the app, but not
 * for a rail that live-refreshes and needs to re-track items that are already on screen.
 *
 * Reports current visibility on every poll tick, unconditionally, rather than only on a change —
 * so it doesn't need to be told when a live refresh happens at all. The caller's own "already
 * tracked" guard (reset on refresh) is what decides whether a given report actually turns into an
 * event; a redundant "still visible" report while that guard is set is just a harmless no-op.
 *
 * Implemented as a hook (rather than a component wrapping the item in an extra View, as an earlier
 * version did) specifically so it doesn't change the rendered tree shape: the caller attaches
 * `ref` directly to its existing content container. Wrapping the content in an additional View
 * confused FlashList's masonry column-height measurement, pushing later items far off-screen.
 */
export const useGridItemVisibility = ({
  ref,
  threshold = 1,
  enabled,
  onVisibilityChange,
}: UseGridItemVisibilityArgs) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  // Read via a ref so the poll below always calls the latest version, regardless of when its
  // closure was created.
  const onVisibilityChangeRef = useRef(onVisibilityChange)
  onVisibilityChangeRef.current = onVisibilityChange

  const measure = useCallback(
    (report: (visible: boolean) => void) => {
      ref.current?.measure(
        (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
          const window = Dimensions.get("window")
          // The visible content area ends above the bottom tab bar, so an item sitting behind it
          // shouldn't count toward the visible fraction — using the raw window height here let
          // items near the bottom tab bar read as "50%+ visible" when most of that overlap was
          // actually hidden behind the tab bar.
          const viewportHeight = window.height - BOTTOM_TABS_HEIGHT - insets.bottom

          const isVisible =
            pageY + height != 0 &&
            pageY >= 0 &&
            pageY + height - height * (1 - threshold) <= viewportHeight &&
            pageX + width > 0 &&
            pageX + width - width * (1 - threshold) <= window.width

          report(isVisible)
        }
      )
    },
    [threshold, ref, insets.bottom]
  )

  // Paused while Home isn't focused (e.g. a pushed artwork screen on top of it) — react-native-
  // screens freezes the Home tree in that state without unmounting it, so this interval would
  // otherwise keep firing a native measure() every second for as long as the user is elsewhere.
  useEffect(() => {
    if (!enabled || !isFocused) {
      return
    }

    const interval = setInterval(() => {
      measure((visible) => onVisibilityChangeRef.current(visible))
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [enabled, isFocused, measure])
}
