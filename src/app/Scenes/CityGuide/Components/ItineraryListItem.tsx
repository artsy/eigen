import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { CARD_SHADOW } from "app/Scenes/CityGuide/utils/constants"
import { RouterLink } from "app/system/navigation/RouterLink"
import { pluralize } from "app/utils/pluralize"

const IMAGE_SIZE = 60
const CARD_RADIUS = 8
// Without a width the rail's card has none to distribute, so its `flex` title column
// collapses to zero and only the image renders.
const CARD_WIDTH = 240
const NO_ICON_SIZE = 24

interface Props {
  title: string
  /** Omitted when nothing knows the count — see `itineraryStopsCount`. */
  stopsCount?: number
  imageUrl?: string | null
  href: string
  /** The share icon on the list screen's rows. The home rail's cards have none. */
  rightSlot?: React.ReactNode
  /** "card" is the home rail's white rounded tile; "row" is the list screen's plain row. */
  variant?: "row" | "card"
  /**
   * Fired before RouterLink's default navigate-on-press. Optional: shared with the
   * itineraries list screen, which has no tap tracking of its own to add here.
   */
  onPress?: () => void
}

export const ItineraryListItem: React.FC<Props> = ({
  title,
  stopsCount,
  imageUrl,
  href,
  rightSlot,
  variant = "row",
  onPress,
}) => {
  const isCard = variant === "card"

  return (
    <RouterLink
      testID="itinerary-list-item"
      to={href}
      onPress={onPress}
      disablePrefetch
      style={
        isCard
          ? {
              width: CARD_WIDTH,
              backgroundColor: "white",
              borderRadius: CARD_RADIUS,
              ...CARD_SHADOW,
            }
          : undefined
      }
    >
      <Flex flexDirection="row" alignItems="center" gap={1} pr={isCard ? 0.5 : 0}>
        {imageUrl ? (
          <Image
            testID="itinerary-list-item-image"
            src={imageUrl}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            resizeMode="cover"
            style={{
              // Only the left corners, so the image meets the card's edge flush.
              borderTopLeftRadius: isCard ? CARD_RADIUS : 0,
              borderBottomLeftRadius: isCard ? CARD_RADIUS : 0,
            }}
          />
        ) : (
          <Flex
            testID="itinerary-list-item-no-image"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            backgroundColor="mono10"
            alignItems="center"
            justifyContent="center"
            borderTopLeftRadius={isCard ? CARD_RADIUS : 0}
            borderBottomLeftRadius={isCard ? CARD_RADIUS : 0}
          >
            <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
          </Flex>
        )}

        <Flex flex={1} py={0.5}>
          <Text variant="sm" weight={isCard ? "medium" : "regular"} numberOfLines={1}>
            {title}
          </Text>

          {stopsCount !== undefined && (
            <Text variant="xs" color="mono60">
              {`${stopsCount} ${pluralize("stop", stopsCount)}`}
            </Text>
          )}
        </Flex>

        {!!rightSlot && <Flex>{rightSlot}</Flex>}
      </Flex>
    </RouterLink>
  )
}
