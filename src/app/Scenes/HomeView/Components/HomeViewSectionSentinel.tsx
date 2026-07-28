import { ContextModule } from "@artsy/cohesion"
import { useIsFocused } from "@react-navigation/native"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { Sentinel } from "app/utils/Sentinel"
import React, { useCallback, useEffect, useRef } from "react"
import { Dimensions, View } from "react-native"

const POLL_INTERVAL = 1000

interface HomeViewSectionSentinelProps {
  contextModule: ContextModule
  sectionType?: string
  index: number
  /**
   * Whether this is one of the "live" rails (WTYL, NWFY) that refetch and re-fire tracking after
   * an interaction. Only these need repeatable visibility tracking (see below) — every other
   * section renders the shared `Sentinel` unchanged.
   */
  isLiveRefreshRail?: boolean
}

export const HomeViewSectionSentinel: React.FC<HomeViewSectionSentinelProps> = ({
  contextModule,
  sectionType,
  index,
  isLiveRefreshRail = false,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)
  const addTrackedSectionTypes = HomeViewStore.useStoreActions(
    (actions) => actions.addTrackedSectionTypes
  )

  const markerRef = useRef<View>(null)
  const isFocused = useIsFocused()

  const handleVisibilityChange = useCallback(
    (visible: boolean) => {
      if (visible && !trackedSections.includes(contextModule)) {
        viewedSection(contextModule as ContextModule, index)
        addTrackedSection(contextModule)
        if (sectionType) {
          addTrackedSectionTypes(sectionType)
        }
      }
    },
    [
      contextModule,
      viewedSection,
      addTrackedSection,
      trackedSections,
      index,
      sectionType,
      addTrackedSectionTypes,
    ]
  )

  // Read via a ref inside the interval below so it always calls the latest version (the poll
  // effect itself only depends on `isLiveRefreshRail`, not on this callback's own dependencies).
  const handleVisibilityChangeRef = useRef(handleVisibilityChange)
  handleVisibilityChangeRef.current = handleVisibilityChange

  // Live rails need to detect visibility repeatedly: on the original scroll-into-view, then again
  // after every live refresh (once the parent resets the "tracked" guard). The shared `Sentinel`
  // only ever fires its first "true" transition — a stale-closure bug in its own polling effect
  // freezes its comparison value at mount, so it can never detect a later re-entry into the
  // viewport. That's harmless for Sentinel's other, fire-once consumers elsewhere in the app, but
  // not for these always-live sections, so we poll directly here instead, scoped to just this case.
  //
  // Reports current visibility on every tick, unconditionally, rather than only on a change — so a
  // live refresh doesn't need to explicitly tell this component anything. `handleVisibilityChange`'s
  // own "already tracked" guard (reset by the parent on refresh) is what decides whether a given
  // report actually fires railViewed; a redundant "still visible" report is a harmless no-op.
  // Paused while Home isn't focused (e.g. a pushed artwork screen on top of it) — react-native-
  // screens freezes the Home tree in that state without unmounting it, so this interval would
  // otherwise keep firing a native measure() every second for as long as the user is elsewhere.
  useEffect(() => {
    if (!isLiveRefreshRail || !isFocused) {
      return
    }

    const interval = setInterval(() => {
      markerRef.current?.measure(
        (_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
          const windowHeight = Dimensions.get("window").height
          handleVisibilityChangeRef.current(pageY + height > 0 && pageY < windowHeight)
        }
      )
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [isLiveRefreshRail, isFocused])

  if (isLiveRefreshRail) {
    return <View ref={markerRef} collapsable={false} testID="home-view-section-sentinel-marker" />
  }

  return <Sentinel onChange={handleVisibilityChange} />
}
