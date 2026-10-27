import { ActionType, ContextModule, OwnerType, RailViewed } from "@artsy/cohesion"
import { Sentinel } from "app/utils/Sentinel"
import { useRef } from "react"
import { useTracking } from "react-tracking"

/** Sends `railViewed` the first time the rail it sits in scrolls into view. */
export const CityGuideRailSentinel: React.FC<{ contextModule: ContextModule }> = ({
  contextModule,
}) => {
  const { trackEvent } = useTracking()
  const hasTracked = useRef(false)

  const handleVisibilityChange = (visible: boolean) => {
    if (!visible || hasTracked.current) return

    hasTracked.current = true
    const event: RailViewed = {
      action: ActionType.railViewed,
      context_module: contextModule,
      context_screen: OwnerType.cityGuide,
    }
    trackEvent(event)
  }

  return <Sentinel onChange={handleVisibilityChange} />
}
