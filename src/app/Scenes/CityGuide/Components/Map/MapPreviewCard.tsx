import { Flex, Text } from "@artsy/palette-mobile"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
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
 * The card shown over the map when a pin is tapped. Holds no Relay or context dependency —
 * `detail` and `saveControl` are injected by the caller, since what they need differs per screen.
 */
export const MapPreviewCard: React.FC<Props> = ({ place, onPress, disableNavigation, isLast }) => {
  return (
    <RouterLink
      to={place.href}
      disableNavigation={disableNavigation || !place.href}
      onPress={onPress}
    >
      <Flex backgroundColor="mono0" borderRadius={4} p={2} ml={2} mr={isLast ? 2 : 0}>
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
