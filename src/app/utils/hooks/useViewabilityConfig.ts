import { GlobalStore } from "app/store/GlobalStore"
import { useRef } from "react"
import { ViewabilityConfig } from "react-native"

const DEFAULT_ITEM_VISIBLE_PERCENT_THRESHOLD = 50
const DEFAULT_MINIMUM_VIEW_TIME_MILLISECONDS = 1000

export const useViewabilityConfig = () => {
  const itemVisiblePercentThreshold = Number(
    GlobalStore.useAppState(
      (state) =>
        state.artsyPrefs.echo.state.messages.find(
          (message) => message.name === "ImpressionsTrackingVisiblePercentThreshold"
        )?.content
    ) ?? DEFAULT_ITEM_VISIBLE_PERCENT_THRESHOLD
  )

  const minimumViewTime = Number(
    GlobalStore.useAppState(
      (state) =>
        state.artsyPrefs.echo.state.messages.find(
          (message) => message.name === "ImpressionsTrackingMinimumViewTimeMilliseconds"
        )?.content
    ) ?? DEFAULT_MINIMUM_VIEW_TIME_MILLISECONDS
  )

  const viewabilityConfig = useRef<ViewabilityConfig>({
    // Percent of of the item that is visible for a partially hidden item to count as "viewable"
    itemVisiblePercentThreshold,
    minimumViewTime,
    waitForInteraction: false,
  }).current

  return viewabilityConfig
}
