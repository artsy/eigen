import { ContextModule } from "@artsy/cohesion"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect, useRef, useState } from "react"
import { ViewToken, ViewabilityConfig } from "react-native"
import { useTracking } from "react-tracking"

type TrackableItem = { id: string; index: number }

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

  const viewabilityConfig = useRef<ViewabilityConfig>({
    // Percent of of the item that is visible for a partially occluded item to count as "viewable"
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 2000,
    waitForInteraction: false,
  }).current

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (enableItemsViewsTracking) {
        const newRenderdItems: Array<TrackableItem> = []
        viewableItems.forEach(({ item, index }) => {
          newRenderdItems.push({ id: item.internalID, index: index! })
        })
        setRenderedItems(newRenderdItems)
      }
    }
  ).current

  useEffect(() => {
    // We would like to trigger the tracking only when the rail is visible and only once per item
    if (enableItemsViewsTracking && isRailVisible && renderedItems.length > 0) {
      renderedItems.forEach(({ id, index }) => {
        if (!trackedItems.has(id)) {
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
