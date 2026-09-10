import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { pluralize } from "app/utils/pluralize"
// TODO: Replace with Image from @artsy/palette-mobile once the itinerary hero is a real image.
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 60
const CARD_RADIUS = 8

interface Props {
  title: string
  stopsCount: number
  imageUrl?: string | null
  href: string
  /** The share icon on the list screen's rows. The home rail's cards have none. */
  rightSlot?: React.ReactNode
  /**
   * Card chrome for the home rail: white, rounded, shadowed, sized to its content. The list
   * screen's rows are plain, on the screen's own background.
   */
  variant?: "row" | "card"
}

/**
 * One itinerary, as both the home rail's card and the list screen's row. The designs give them
 * the same innards — a 60pt image, the name, and "N stops" — and differ only in chrome, so
 * this takes a variant rather than existing twice.
 */
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
        <RNImage
          testID="itinerary-list-item-image"
          source={{ uri: imageUrl ?? undefined }}
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

        <Flex flex={1} py={0.5}>
          <Text variant="sm" weight={isCard ? "medium" : "regular"} numberOfLines={1}>
            {title}
          </Text>

          <Text variant="xs" color="mono60">
            {`${stopsCount} ${pluralize("stop", stopsCount)}`}
          </Text>
        </Flex>

        {!!rightSlot && <Flex>{rightSlot}</Flex>}
      </Flex>
    </RouterLink>
  )
}
