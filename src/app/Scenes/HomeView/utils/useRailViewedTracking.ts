import { ContextModule } from "@artsy/cohesion"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { useRef } from "react"
import { ViewabilityConfig, ViewToken } from "react-native"
import { useTracking } from "react-tracking"

export function useRailViewedTracking<T>({
  keyExtractor,
  filterSection,
}: {
  keyExtractor: (item: T) => string | null | undefined
  filterSection: (item: T) => boolean
}) {
  const viewedRails = useRef<Set<string>>(new Set()).current
  const tracking = useTracking()

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const newVisibleRails = new Set<string>()

      // Track currently visible rails // needed to enable tracking artwork views
      viewableItems.forEach(({ item }: { item: T }) => {
        const key = keyExtractor(item)
        if (key) {
          newVisibleRails.add(key)
        }
      })

      // Track all viewed rails
      viewableItems.forEach(({ item }: { item: T }) => {
        const key = keyExtractor(item)
        if (key && !viewedRails.has(key) && !filterSection(item)) {
          viewedRails.add(key)
          tracking.trackEvent(
            HomeAnalytics.trackRailViewed({
              contextModule: key as ContextModule,
            })
          )
        }
      })
    }
  ).current

  const viewabilityConfig = useRef<ViewabilityConfig>({
    // Percent of of the item that is visible for a partially occluded item to count as "viewable"
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
    waitForInteraction: false,
  }).current

  return {
    viewabilityConfig,
    onViewableItemsChanged,
  }
}
