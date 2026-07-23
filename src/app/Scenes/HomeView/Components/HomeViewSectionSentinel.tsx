import { ContextModule } from "@artsy/cohesion"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { Sentinel } from "app/utils/Sentinel"
import React, { useCallback, useEffect, useRef } from "react"
import { Dimensions, View } from "react-native"

interface HomeViewSectionSentinelProps {
  contextModule: ContextModule
  sectionType?: string
  index: number
  /**
   * Bumped by the parent every time a forced live-refresh of this section completes. We re-fire
   * railViewed if the section is on screen at that moment.
   */
  refreshKey?: number
}

export const HomeViewSectionSentinel: React.FC<HomeViewSectionSentinelProps> = ({
  contextModule,
  sectionType,
  index,
  refreshKey = 0,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)
  const addTrackedSectionTypes = HomeViewStore.useStoreActions(
    (actions) => actions.addTrackedSectionTypes
  )

  const markerRef = useRef<View>(null)

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

  // On a live refresh, re-fire railViewed if this section is on screen right now. We re-measure the
  // section's actual position directly instead of relying on `viewableSections` (populated by the
  // home list's own viewability callback), which can still hold a stale value from before
  // navigating away right as the screen regains focus and the refetch completes.
  useEffect(() => {
    if (refreshKey === 0) {
      return
    }

    const raf = requestAnimationFrame(() => {
      markerRef.current?.measure(
        (_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
          const windowHeight = Dimensions.get("window").height
          const isOnScreen = pageY + height > 0 && pageY < windowHeight

          if (isOnScreen) {
            viewedSection(contextModule, index)
          }
        }
      )
    })

    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  return (
    <View ref={markerRef} collapsable={false}>
      <Sentinel onChange={handleVisibilityChange} />
    </View>
  )
}
