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
}

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
          // Only the home rail's card keeps a placeholder box — the list screen's plain row
          // just drops the image section instead.
          isCard && (
            <Flex
              testID="itinerary-list-item-no-image"
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              backgroundColor="mono10"
              alignItems="center"
              justifyContent="center"
              borderTopLeftRadius={CARD_RADIUS}
              borderBottomLeftRadius={CARD_RADIUS}
            >
              <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
            </Flex>
          )
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
