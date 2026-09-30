import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { StopCard } from "app/Scenes/CityGuide/Components/StopCard"
import { useTracking } from "react-tracking"

interface Props {
  place: MapPlace
  /** The city this map belongs to, for the tap event's context. */
  citySlug: string
  /**
   * Fired before StopCard's navigation. The cluster rail uses this with
   * `disableNavigation` so tapping a card selects a place instead of navigating off the map.
   */
  onPress?: () => void
  /** Forces select-only behaviour, even when the place has an `href`. See `onPress`. */
  disableNavigation?: boolean
  isLast?: boolean
}

/** Every map preview uses the same card as an itinerary stop. */
export const MapPreviewCard: React.FC<Props> = ({
  place,
  citySlug,
  onPress,
  disableNavigation,
  isLast,
}) => {
  const { trackEvent } = useTracking()

  // `isLast` is only ever passed `false` by the cluster rail, whose next card supplies its
  // own left margin as spacing — everywhere else (including the single-pin preview, which
  // never passes it) there's no next card, so the right edge gets the same margin as the left.
  const mr = isLast === false ? 0 : 2

  const handlePress = () => {
    onPress?.()

    // Only counts as a tap-through when the card will actually navigate — the cluster rail
    // also uses `onPress` for select-only cards, which aren't a navigation event.
    if (place.href && !disableNavigation) {
      trackEvent(tracks.tappedCard(citySlug, place.href))
    }
  }

  return (
    <Flex ml={2} mr={mr}>
      <StopCard
        card={place.card ?? { kind: "custom", title: place.title }}
        image={place.image}
        href={place.href}
        onPress={handlePress}
        disableNavigation={disableNavigation}
        saveControl={place.saveControl}
      />
    </Flex>
  )
}

const tracks = {
  // `MapPlace` carries no entity type of its own — a stop, a fair and a plain city event all
  // arrive here alike — so the destination is the raw path rather than an owner type/id/slug.
  tappedCard: (citySlug: string, destinationPath: string) => ({
    action: ActionType.tappedCardGroup,
    context_module: ContextModule.cityGuideCard,
    context_screen_owner_type: OwnerType.cityGuideMap,
    context_screen_owner_slug: citySlug,
    destination_path: destinationPath,
  }),
}
