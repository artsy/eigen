import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { StopCard } from "app/Scenes/CityGuide/Components/StopCard"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useTracking } from "react-tracking"

interface Props {
  place: MapPlace
  /** The city this map belongs to, for the tap event's context. */
  citySlug: string
  /**
   * Fired before RouterLink's default navigate-on-press. The cluster rail uses this with
   * `disableNavigation` so tapping a card selects a place instead of navigating off the map.
   */
  onPress?: () => void
  /** Forces select-only behaviour, even when the place has an `href`. See `onPress`. */
  disableNavigation?: boolean
  isLast?: boolean
}

/**
 * The card shown over the map when a pin is tapped. An itinerary stop carries a `card`, and
 * renders the same `StopCard` as the itinerary list, so a stop looks identical on the map and
 * in the list — `StopCard` owns its own link and renders `saveControl` inside itself. A plain
 * city-event place carries no `card` — only its own `title`/`detail` — and falls back to the
 * simpler layout it always had. Holds no Relay or context dependency of its own — `detail` and
 * `saveControl` are injected by the caller.
 */
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

  if (place.card) {
    return (
      <Flex ml={2} mr={mr}>
        <StopCard
          card={place.card}
          image={place.image}
          href={place.href}
          onPress={handlePress}
          disableNavigation={disableNavigation}
          saveControl={place.saveControl}
        />
      </Flex>
    )
  }

  return (
    <RouterLink
      to={place.href}
      disableNavigation={disableNavigation || !place.href}
      onPress={handlePress}
    >
      <Flex backgroundColor="mono0" borderRadius={4} p={2} ml={2} mr={mr}>
        <Flex flexDirection="row" alignItems="center" gap={1}>
          <Flex flex={1}>
            <Text variant="sm-display" numberOfLines={1} ellipsizeMode="tail">
              {place.title}
            </Text>

            {place.detail}
          </Flex>

          {place.saveControl}
        </Flex>
      </Flex>
    </RouterLink>
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
