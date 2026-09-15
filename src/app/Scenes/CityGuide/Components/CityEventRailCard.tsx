import { Flex, Image, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"

/**
 * Both the card and its image box, which the designs keep square (Figma reports the image as
 * 150 × 149 inside a 150 × 150 box — a rounding artifact, not a 1px gap).
 */
const CARD_SIZE = 150
const ARCH_RADIUS = 80

interface Props {
  image: string
  title: string
  href: string
  /** The date line: a range for a running show, a single date for one opening soon. */
  meta: string
  /** "Free" or "Paid Entry". Omitted by Opening Soon, which shows no admission line. */
  admission?: string
  /** Arches the top of the image. The Opening Soon rail is the only one that asks for it. */
  archTopImage?: boolean
  saveControl?: React.ReactNode
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
  saveControl,
}) => {
  return (
    <Flex width={CARD_SIZE} gap={0.5}>
      <RouterLink to={href} disablePrefetch>
        <Image
          testID="city-event-rail-card-image"
          src={image}
          width={CARD_SIZE}
          height={CARD_SIZE}
          resizeMode="cover"
          style={{
            borderTopLeftRadius: archTopImage ? ARCH_RADIUS : 0,
            borderTopRightRadius: archTopImage ? ARCH_RADIUS : 0,
          }}
        />
      </RouterLink>

      {/* alignItems="flex-start" keeps the control level with the title rather than centred
          against a caption whose height changes with the admission line. */}
      <Flex flexDirection="row" alignItems="flex-start">
        <RouterLink to={href} disablePrefetch style={{ flex: 1 }}>
          <Flex flex={1}>
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
        </RouterLink>

        {!!saveControl && <Flex>{saveControl}</Flex>}
      </Flex>
    </Flex>
  )
}
