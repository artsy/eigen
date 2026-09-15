import { Flex, Text } from "@artsy/palette-mobile"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { StopCard } from "app/Scenes/CityGuide/Components/StopCard"
import { RouterLink } from "app/system/navigation/RouterLink"

interface Props {
  place: MapPlace
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
export const MapPreviewCard: React.FC<Props> = ({ place, onPress, disableNavigation, isLast }) => {
  // `isLast` is only ever passed `false` by the cluster rail, whose next card supplies its
  // own left margin as spacing — everywhere else (including the single-pin preview, which
  // never passes it) there's no next card, so the right edge gets the same margin as the left.
  const mr = isLast === false ? 0 : 2

  if (place.card) {
    return (
      <Flex ml={2} mr={mr}>
        <StopCard
          card={place.card}
          image={place.image}
          href={place.href}
          onPress={onPress}
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
      onPress={onPress}
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
