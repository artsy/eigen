import { useEchoMessage } from "app/utils/hooks/useEchoMessage"
import { useRef } from "react"
import { ViewabilityConfig } from "react-native"

const DEFAULT_ITEM_VISIBLE_PERCENT_THRESHOLD = 50
const DEFAULT_MINIMUM_VIEW_TIME_MILLISECONDS = 1000

export const useViewabilityConfig = () => {
  const itemVisiblePercentThreshold = Number(
    useEchoMessage("ImpressionsTrackingVisiblePercentThreshold") ??
      DEFAULT_ITEM_VISIBLE_PERCENT_THRESHOLD
  )

  const minimumViewTime = Number(
    useEchoMessage("ImpressionsTrackingMinimumViewTimeMilliseconds") ??
      DEFAULT_MINIMUM_VIEW_TIME_MILLISECONDS
  )

  const viewabilityConfig = useRef<ViewabilityConfig>({
    // Percent of of the item that is visible for a partially hidden item to count as "viewable"
    itemVisiblePercentThreshold,
    minimumViewTime,
    waitForInteraction: false,
  }).current

  return viewabilityConfig
}
