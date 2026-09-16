import { useAddToItinerary } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityGuideSaveButton } from "app/Scenes/CityGuide/Components/CityGuideSaveButton"
import { CityItineraryItemType } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { Schema } from "app/utils/track"
import { useTracking } from "react-tracking"

interface Props {
  /** What the stop would point at. A gallery is a `LOCATION`: a stop names the place. */
  itemType: CityItineraryItemType
  /** The entity's own id, not its profile's — that is what a stop stores. */
  itemID: string
  /** Used for the accessibility label and nothing else. */
  name: string
  isOnMyItineraries?: boolean | null
  myItineraries?: readonly { readonly internalID: string }[] | null
  /** The itinerary stop that led here, when there is one. Used to refresh memberships. */
  sourceStopID?: string
  sourceShareToken?: string | null
  /** Forwarded to `CityGuideSaveButton`. The rail cards pass 18, per their designs. */
  iconSize?: number
}

/** Which tracking names each type sends. Eigen already had all six. */
const TRACKING: Record<
  CityItineraryItemType,
  { action: Schema.ActionNames; ownerType: Schema.OwnerEntityTypes }
> = {
  SHOW: { action: Schema.ActionNames.SaveShow, ownerType: Schema.OwnerEntityTypes.Show },
  FAIR: { action: Schema.ActionNames.FollowFair, ownerType: Schema.OwnerEntityTypes.Fair },
  // `OwnerEntityTypes` has no `Gallery`, so this uses `Partner`, the type Metaphysics uses.
  LOCATION: {
    action: Schema.ActionNames.GalleryFollow,
    ownerType: Schema.OwnerEntityTypes.Partner,
  },
}

/**
 * The plus on every City Guide card, row and map card.
 *
 * It opens the Add to Itinerary sheet. It used to follow the entity, which is why it had a
 * saved state; adding is now the only thing it does, and which itineraries hold the entity is
 * the sheet's business, so the glyph is always a plus.
 *
 * Renders nothing without an `AddToItineraryProvider` above it — a plus that did nothing when
 * tapped would be worse than none.
 */
export const CityEventSaveControl: React.FC<Props> = ({
  itemType,
  itemID,
  name,
  iconSize,
  isOnMyItineraries,
  myItineraries,
  sourceStopID,
  sourceShareToken,
}) => {
  const addToItinerary = useAddToItinerary()
  const { trackEvent } = useTracking<Schema.Entity>()

  if (!addToItinerary) {
    return null
  }

  return (
    <CityGuideSaveButton
      iconSize={iconSize}
      isSaved={!!isOnMyItineraries}
      accessibilityLabel={
        isOnMyItineraries ? `${name} is on an itinerary` : `Add ${name} to an itinerary`
      }
      onPress={() => {
        const { action, ownerType } = TRACKING[itemType]

        trackEvent({
          action_name: action,
          action_type: Schema.ActionTypes.Tap,
          owner_type: ownerType,
          owner_id: itemID,
        })

        addToItinerary.open({
          itemType,
          itemID,
          isOnMyItineraries,
          myItineraries,
          sourceStopID,
          sourceShareToken: sourceShareToken ?? undefined,
        })
      }}
    />
  )
}
