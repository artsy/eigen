import { ContextModule } from "@artsy/cohesion"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useViewabilityConfig } from "app/utils/hooks/useViewabilityConfig"
import { useEffect, useRef, useState } from "react"
import { ViewToken } from "react-native"
import { useTracking } from "react-tracking"

type TrackableItem = { id: string; index: number | null }

export const useItemsImpressionsTracking = ({
  isRailVisible = true,
  contextModule,
}: {
  contextModule: ContextModule
  isRailVisible: boolean
}) => {
  // An array of items that are currently rendered on the screen // not necessarily visible!
  const [renderedItems, setRenderedItems] = useState<Array<TrackableItem>>([])
  const trackedItems = useRef<Set<string>>(new Set()).current

  const tracking = useTracking()

  const enableItemsViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")

  const viewabilityConfig = useViewabilityConfig()

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (enableItemsViewsTracking) {
        const newRenderdItems: Array<TrackableItem> = []

        viewableItems.forEach(({ item, index }) => {
          newRenderdItems.push({ id: item.internalID, index })
        })
        setRenderedItems(newRenderdItems)
      }
    }
  ).current

  useEffect(() => {
    // We would like to trigger the tracking only when the rail is visible and only once per item
    if (enableItemsViewsTracking && isRailVisible && renderedItems.length > 0) {
      renderedItems.forEach(({ id, index }) => {
        if (!trackedItems.has(id) && index !== null) {
          tracking.trackEvent(
            HomeAnalytics.trackItemViewed({
              artworkId: id,
              type: "artwork",
              contextModule: contextModule,
              position: index,
            })
          )
          trackedItems.add(id)
        }
      })
    }
  }, [enableItemsViewsTracking, isRailVisible, tracking, renderedItems])

  return {
    onViewableItemsChanged,
    viewabilityConfig,
  }
}
