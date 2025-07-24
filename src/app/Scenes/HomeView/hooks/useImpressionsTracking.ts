import { ContextModule, OwnerType } from "@artsy/cohesion"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useViewabilityConfig } from "app/utils/hooks/useViewabilityConfig"
import { useCallback, useEffect, useRef, useState } from "react"
import { ViewToken } from "react-native"
import { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated"
import { useTracking } from "react-tracking"

type TrackableItem = { id: string; index: number | null }

export const useItemsImpressionsTracking = ({
  isInViewport = true,
  contextModule,
  contextScreenOwnerType,
}: {
  contextModule: ContextModule
  isInViewport: boolean
  contextScreenOwnerType?: OwnerType
}) => {
  // Use different state management for test vs production
  const renderedItems = useSharedValue<Array<TrackableItem>>([])
  const [testRenderedItems, setTestRenderedItems] = useState<Array<TrackableItem>>([])

  const trackedItems = useRef<Set<string>>(new Set()).current

  const tracking = useTracking()

  const enableItemsViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")

  const viewabilityConfig = useViewabilityConfig()

  const trackItems = useCallback(
    (items: Array<TrackableItem>) => {
      // We would like to trigger the tracking only when the rail is visible and only once per item
      if (enableItemsViewsTracking && isInViewport && items.length > 0) {
        items.forEach(({ id, index }) => {
          if (!trackedItems.has(id) && index !== null) {
            tracking.trackEvent(
              HomeAnalytics.trackItemViewed({
                artworkId: id,
                type: "artwork",
                contextModule: contextModule,
                contextScreenOwnerType: contextScreenOwnerType,
                position: index,
              })
            )
            trackedItems.add(id)
          }
        })
      }
    },
    [
      enableItemsViewsTracking,
      isInViewport,
      trackedItems,
      tracking,
      contextModule,
      contextScreenOwnerType,
    ]
  )

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (enableItemsViewsTracking) {
        const newRenderedItems: Array<TrackableItem> = []

        viewableItems.forEach(({ item, index }) => {
          newRenderedItems.push({ id: item.internalID, index })
        })

        if (__TEST__) {
          // Use regular state for tests
          setTestRenderedItems(newRenderedItems)
        } else {
          // Use shared value for production
          renderedItems.value = newRenderedItems
        }
      }
    }
  ).current

  // Test environment tracking with useEffect watching regular state
  useEffect(() => {
    if (__TEST__) {
      trackItems(testRenderedItems)
    }
  }, [
    testRenderedItems,
    enableItemsViewsTracking,
    isInViewport,
    contextScreenOwnerType,
    contextModule,
    trackItems,
  ])

  // Production environment - use Reanimated
  useAnimatedReaction(
    () => renderedItems.value,
    (currentItems) => {
      if (!__TEST__) {
        runOnJS(trackItems)(currentItems)
      }
    },
    [enableItemsViewsTracking, isInViewport, contextScreenOwnerType, contextModule]
  )

  return {
    onViewableItemsChanged,
    viewabilityConfig,
  }
}
