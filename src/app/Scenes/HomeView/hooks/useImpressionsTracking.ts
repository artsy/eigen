import { ContextModule, OwnerType } from "@artsy/cohesion"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useViewabilityConfig } from "app/utils/hooks/useViewabilityConfig"
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { ViewToken } from "react-native"
import { useTracking } from "react-tracking"

type TrackableItem = { id: string; index: number | null }

const trackedItems = new Set<string>()

export const useItemsImpressionsTracking = ({
  isInViewport = true,
  contextModule,
  contextScreenOwnerType,
}: {
  contextModule: ContextModule
  isInViewport: boolean
  contextScreenOwnerType?: OwnerType
}) => {
  const tracking = useTracking()

  const enableItemsViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")
  const viewabilityConfig = useViewabilityConfig()
  const initialItem = useRef<ViewToken | null>(null)
  const hasTrackedInitialItem = useRef(false)

  const isInvViewportRef = useRef(isInViewport)

  const trackInitialItemIfNeeded = useCallback(() => {
    if (
      !hasTrackedInitialItem.current &&
      initialItem.current &&
      !trackedItems.has(initialItem.current.item.internalID)
    ) {
      tracking.trackEvent(
        HomeAnalytics.trackItemViewed({
          artworkId: initialItem.current.item.internalID,
          type: "artwork",
          contextModule: contextModule,
          contextScreenOwnerType: contextScreenOwnerType,
          position: 0,
        })
      )
      trackedItems.add(initialItem.current.item.internalID)
      hasTrackedInitialItem.current = true
    }
  }, [contextModule, contextScreenOwnerType, tracking])

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (initialItem.current === null) {
        initialItem.current = viewableItems[0]
        trackInitialItemIfNeeded()
      }

      if (enableItemsViewsTracking && isInvViewportRef.current) {
        // Track all currently viewable items
        const newRenderedItems: Array<TrackableItem> = []

        viewableItems.forEach(({ item, index }) => {
          newRenderedItems.push({ id: item.internalID, index })
        })

        newRenderedItems.map((item) => {
          if (
            !trackedItems.has(item.id) &&
            item.index !== null &&
            item.id !== initialItem.current?.item.internalID
          ) {
            tracking.trackEvent(
              HomeAnalytics.trackItemViewed({
                artworkId: item.id,
                type: "artwork",
                contextModule: contextModule,
                contextScreenOwnerType: contextScreenOwnerType,
                position: item.index,
              })
            )
            trackedItems.add(item.id)
          }
        })
      }
    }
  ).current

  useLayoutEffect(() => {
    isInvViewportRef.current = isInViewport
  }, [isInViewport])

  useEffect(() => {
    if (isInViewport) {
      trackInitialItemIfNeeded()
    }
  }, [isInViewport, trackInitialItemIfNeeded])

  return {
    onViewableItemsChanged,
    viewabilityConfig,
  }
}
