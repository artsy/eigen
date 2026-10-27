import { ActionType, ContextModule, OwnerType, RailViewed } from "@artsy/cohesion"
import { Sentinel } from "app/utils/Sentinel"
import { useState } from "react"
import { useTracking } from "react-tracking"

/** Sends `railViewed` the first time the rail it sits in scrolls into view. */
export const CityGuideRailSentinel: React.FC<{ contextModule: ContextModule }> = ({
  contextModule,
}) => {
  const { trackEvent } = useTracking()
  // Unmounting the Sentinel once tracked stops its 1s measure interval.
  const [hasTracked, setHasTracked] = useState(false)

  const handleVisibilityChange = (visible: boolean) => {
    if (!visible || hasTracked) return

    setHasTracked(true)
    const event: RailViewed = {
      action: ActionType.railViewed,
      context_module: contextModule,
      context_screen: OwnerType.cityGuide,
    }
    trackEvent(event)
  }

  if (hasTracked) return null

  return <Sentinel onChange={handleVisibilityChange} />
}
