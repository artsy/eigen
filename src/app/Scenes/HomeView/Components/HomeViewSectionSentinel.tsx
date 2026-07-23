import { ContextModule } from "@artsy/cohesion"
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
  /**
   * Bumped by the parent every time a forced live-refresh of this section completes. Only used
   * when `isLiveRefreshRail` is true.
   */
  refreshKey?: number
}

export const HomeViewSectionSentinel: React.FC<HomeViewSectionSentinelProps> = ({
  contextModule,
  sectionType,
  index,
  isLiveRefreshRail = false,
  refreshKey = 0,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)
  const addTrackedSectionTypes = HomeViewStore.useStoreActions(
    (actions) => actions.addTrackedSectionTypes
  )

  const markerRef = useRef<View>(null)
  const isVisibleRef = useRef(false)

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
    [contextModule, viewedSection, addTrackedSection, trackedSections, index, sectionType]
  )

  // Read via a ref inside the interval below so it always calls the latest version (the poll
  // effect itself only depends on `isLiveRefreshRail`, not on this callback's own dependencies).
  const handleVisibilityChangeRef = useRef(handleVisibilityChange)
  handleVisibilityChangeRef.current = handleVisibilityChange

  const measure = useCallback((report: (visible: boolean) => void) => {
    markerRef.current?.measure(
      (_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
        const windowHeight = Dimensions.get("window").height
        report(pageY + height > 0 && pageY < windowHeight)
      }
    )
  }, [])

  // Live rails need to detect visibility repeatedly: on the original scroll-into-view, then again
  // after every live refresh (once the parent resets the "tracked" guard). The shared `Sentinel`
  // only ever fires its first "true" transition — a stale-closure bug in its own polling effect
  // freezes its comparison value at mount, so it can never detect a later re-entry into the
  // viewport. That's harmless for Sentinel's other, fire-once consumers elsewhere in the app, but
  // not for these always-live sections, so we poll directly here instead, scoped to just this case.
  useEffect(() => {
    if (!isLiveRefreshRail) {
      return
    }

    const interval = setInterval(() => {
      measure((visible) => {
        if (visible !== isVisibleRef.current) {
          isVisibleRef.current = visible
          handleVisibilityChangeRef.current(visible)
        }
      })
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [isLiveRefreshRail, measure])

  // On a live refresh, re-check whether this section is on screen right now (the parent has already
  // reset the "tracked" guard for us). We re-measure the section's actual position directly instead
  // of relying on `viewableSections` (populated by the home list's own viewability callback), which
  // can still hold a stale value from before navigating away right as the screen regains focus and
  // the refetch completes. If the section isn't on screen at this exact moment (e.g. a pull-to-
  // refresh triggered from the top of the list), this is a no-op — the guard reset means the poll
  // above will pick it up on a later scroll-into-view instead.
  useEffect(() => {
    if (!isLiveRefreshRail || refreshKey === 0) {
      return
    }

    const raf = requestAnimationFrame(() => {
      measure((visible) => {
        isVisibleRef.current = visible
        handleVisibilityChangeRef.current(visible)
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [isLiveRefreshRail, refreshKey, measure])

  if (isLiveRefreshRail) {
    return <View ref={markerRef} collapsable={false} />
  }

  return <Sentinel onChange={handleVisibilityChange} />
}
