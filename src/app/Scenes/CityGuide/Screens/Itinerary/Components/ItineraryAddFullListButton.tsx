import { ActionType, OwnerType } from "@artsy/cohesion"
import { Button } from "@artsy/palette-mobile"
import { useAddToItinerary } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { StopTarget } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import { useTracking } from "react-tracking"

interface Props {
  /** The itinerary's own id, for the tap tracking event only. */
  itineraryId: string
  /** The itinerary's own slug, for tracking only. */
  itinerarySlug?: string
  /** Every stop in the guide, computed by `ItineraryScreen` from the sections it already has. */
  targets: StopTarget[]
}

/**
 * Opens the Add to Itinerary sheet with every stop in the guide already queued up — the same
 * sheet a single stop's own plus opens, in its bulk (add-only) mode. Picking an itinerary adds
 * whichever of the guide's stops it doesn't already hold; one already fully added shows that
 * in the sheet itself, so this button has no "Added" state of its own to track.
 *
 * Renders nothing without an `AddToItineraryProvider` above it, same as every other plus in
 * City Guide — a button that did nothing when tapped would be worse than none.
 */
export const ItineraryAddFullListButton: React.FC<Props> = ({
  itineraryId,
  itinerarySlug,
  targets,
}) => {
  const addToItinerary = useAddToItinerary()
  const { trackEvent: trackCohesionEvent } = useTracking()

  if (!addToItinerary) {
    return null
  }

  return (
    <Button
      testID="itinerary-add-full-list"
      variant="outline"
      size="small"
      onPress={() => {
        trackCohesionEvent({
          action: ActionType.tappedAddFullListToItinerary,
          context_screen_owner_type: OwnerType.cityGuideGuide,
          context_screen_owner_id: itineraryId,
          context_screen_owner_slug: itinerarySlug,
        })

        addToItinerary.open(targets)
      }}
      longestText="Add Full List"
    >
      Add Full List
    </Button>
  )
}
