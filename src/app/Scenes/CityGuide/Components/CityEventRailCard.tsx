import { AddStrokeIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once the images come from the API.
import { Image as RNImage } from "react-native"

/**
 * Both the card and its image box, which the designs keep square (Figma reports the image as
 * 150 × 149 inside a 150 × 150 box — a rounding artifact, not a 1px gap).
 */
const CARD_SIZE = 150
const ADD_ICON_SIZE = 18
/**
 * The arch the designs put on Opening Soon images. 80 is past half the card's width, so it
 * renders as a full semicircle — React Native clamps a corner radius to half the side.
 */
const ARCH_RADIUS = 80

interface Props {
  image: string
  title: string
  /** Where a tap goes — the show's or fair's own page. */
  href: string
  /** The date line: a range for a running show, a single date for one opening soon. */
  meta: string
  /** "Free" or "Paid Entry". Omitted by Opening Soon, which shows no admission line. */
  admission?: string
  /** Arches the top of the image. The Opening Soon rail is the only one that asks for it. */
  archTopImage?: boolean
}

/**
 * The caption-below card used by both the Current Shows and Opening Soon rails. It is one card
 * in the designs, varying in two ways: Opening Soon arches the top of its image and shows no
 * admission line. Both are props here rather than a second near-identical component.
 */
export const CityEventRailCard: React.FC<Props> = ({
  image,
  title,
  href,
  meta,
  admission,
  archTopImage = false,
}) => {
  return (
    // The whole card is the tap target, the add icon included — it is inert today. Once it
    // becomes a real save control it will be a Touchable child, and this link will need
    // `hasChildTouchable` so the two do not both fire.
    <RouterLink to={href} style={{ width: CARD_SIZE }}>
      <Flex gap={0.5}>
        <RNImage
          testID="city-event-rail-card-image"
          source={{ uri: image }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          style={{
            width: CARD_SIZE,
            height: CARD_SIZE,
            borderTopLeftRadius: archTopImage ? ARCH_RADIUS : 0,
            borderTopRightRadius: archTopImage ? ARCH_RADIUS : 0,
          }}
        />

        {/* alignItems="flex-start" keeps the icon level with the title rather than centred
          against a caption whose height changes with the admission line. */}
        <Flex flexDirection="row" alignItems="flex-start">
          <Flex flex={1}>
            {/* One line, as the designs show ("One Fly Makes No S…"). */}
            <Text variant="xs" weight="medium" numberOfLines={1}>
              {title}
            </Text>

            <Text variant="xs" color="mono60">
              {meta}
            </Text>

            {!!admission && (
              <Text variant="xs" color="mono60">
                {admission}
              </Text>
            )}
          </Flex>

          {/* The save control in the real feature. Nothing on this screen has a save target to
            mutate yet, so it renders as the designed glyph without a press handler. */}
          <AddStrokeIcon width={ADD_ICON_SIZE} height={ADD_ICON_SIZE} />
        </Flex>
      </Flex>
    </RouterLink>
  )
}
