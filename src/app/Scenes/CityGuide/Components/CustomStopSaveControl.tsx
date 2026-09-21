import { ActionType, ScreenOwnerType } from "@artsy/cohesion"
import { useAddToItinerary } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityGuideSaveButton } from "app/Scenes/CityGuide/Components/CityGuideSaveButton"
import { CustomStopInput } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { useTracking } from "react-tracking"

interface Props {
  /** What gets copied. The same shape the Add to Itinerary sheet takes for a custom stop. */
  stop: CustomStopInput
  citySlug: string
  /** The city's own name, which is what a new itinerary and its section are called. */
  cityName: string
  size?: number
  /** Where this plus is rendered — every caller renders from a different screen, so this has
   *  no sensible default. */
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  /** Whether this plus sits on a curated guide's own stop list, rather than the viewer's
   *  personal itinerary or somewhere outside City Guide entirely. */
  isCuratedGuide?: boolean
}

/**
 * The plus on a custom stop — a cafe, a landmark, anything with no Artsy entity behind it.
 *
 * Opens the Add to Itinerary sheet exactly as `CityEventSaveControl` does for an Artsy stop,
 * copying the stop's own fields across rather than pointing at an entity id. Which itineraries
 * already hold it is the sheet's business, so the glyph is always a plus.
 *
 * Renders nothing without an `AddToItineraryProvider` above it — a plus that did nothing when
 * tapped would be worse than none.
 */
export const CustomStopSaveControl: React.FC<Props> = ({
  stop,
  citySlug,
  cityName,
  size,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  isCuratedGuide = false,
}) => {
  const addToItinerary = useAddToItinerary()
  const { trackEvent: trackCohesionEvent } = useTracking()

  if (!addToItinerary) {
    return null
  }

  return (
    <CityGuideSaveButton
      testID="custom-stop-save-button"
      iconSize={size}
      isSaved={!!stop.isOnMyItineraries}
      accessibilityLabel={
        stop.isOnMyItineraries
          ? `${stop.title} is on an itinerary`
          : `Add ${stop.title} to an itinerary`
      }
      onPress={() => {
        trackCohesionEvent({
          action: ActionType.tappedAddToItinerary,
          context_screen_owner_type: contextScreenOwnerType,
          context_screen_owner_id: contextScreenOwnerId,
          context_screen_owner_slug: contextScreenOwnerSlug,
          // A custom stop has no Artsy entity behind it, so there is no destination to name.
          is_curated_guide: isCuratedGuide,
        })

        addToItinerary.open({ ...stop, citySlug, cityName })
      }}
    />
  )
}
