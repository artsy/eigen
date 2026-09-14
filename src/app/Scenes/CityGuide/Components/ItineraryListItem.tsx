import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { pluralize } from "app/utils/pluralize"
// TODO: Replace with Image from @artsy/palette-mobile once the itinerary hero is a real image.
import { Image as RNImage } from "react-native"

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
}

/** One itinerary, as the home rail's card or the list screen's row: same innards, different chrome. */
export const ItineraryListItem: React.FC<Props> = ({
  title,
  stopsCount,
  imageUrl,
  href,
  rightSlot,
  variant = "row",
}) => {
  const isCard = variant === "card"

  return (
    <RouterLink
      testID="itinerary-list-item"
      to={href}
      disablePrefetch
      style={
        isCard
          ? {
              width: CARD_WIDTH,
              backgroundColor: "white",
              borderRadius: CARD_RADIUS,
              // The designs' Dropshadow/100. elevation is Android's equivalent; iOS reads the
              // shadow* properties.
              shadowColor: "black",
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 10,
              elevation: 2,
            }
          : undefined
      }
    >
      <Flex flexDirection="row" alignItems="center" gap={1} pr={isCard ? 0.5 : 0}>
        {imageUrl ? (
          <RNImage
            testID="itinerary-list-item-image"
            source={{ uri: imageUrl }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            style={{
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              // Only the left corners, so the image meets the card's edge flush.
              borderTopLeftRadius: isCard ? CARD_RADIUS : 0,
              borderBottomLeftRadius: isCard ? CARD_RADIUS : 0,
            }}
          />
        ) : (
          // No hero until someone uploads one, and createItinerary takes no image.
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
