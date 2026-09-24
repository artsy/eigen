import { Flex, Image, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { TypeEyebrow } from "app/Components/TypeEyebrow"
import { StopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useState } from "react"

/** The designs' card image: taller than square, at 60 wide. Flush with the card's own corners. */
const IMAGE_WIDTH = 60
/** The card's own height, which the image matches. Grows with the text — see `textHeight`. */
const CARD_HEIGHT = 70
/** The dot between hours and admission. */
const DOT_SIZE = 4
const CARD_RADIUS = 8
const ROW_STYLE = { flex: 1 } as const

/** Figma's `Dropshadow/100`: #00000014, offset (0, 2), blur 10. */
const CARD_SHADOW = {
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 2,
} as const

interface Props {
  card: StopCardFields
  image?: { url: string; blurhash?: string | null } | null
  href?: string | null
  accessibilityLabel?: string
  onPress?: () => void
  /** Forces select-only behaviour, even with an `href`. */
  disableNavigation?: boolean
  /** Rendered inside the card, outside the touchable, so tapping it saves rather than navigates. */
  saveControl?: React.ReactNode
}

/**
 * The one visual definition of a stop, shared by the itinerary list (`ItineraryStopRow`) and
 * the map's pin-tap preview (`MapPreviewCard`), so the two never drift from each other.
 */
export const StopCard: React.FC<Props> = ({
  card,
  image,
  href,
  accessibilityLabel,
  onPress,
  disableNavigation,
  saveControl,
}) => {
  // The image needs a concrete height number (it can't stretch to match a sibling's), so this
  // measures the text column and grows the image to match once a wrapped title — or large
  // accessibility text — pushes the card past its normal 70; never below that floor.
  const [textHeight, setTextHeight] = useState(CARD_HEIGHT)
  const cardHeight = Math.max(CARD_HEIGHT, textHeight)
  const color = useColor()

  const handlePress = () => {
    onPress?.()

    if (href && !disableNavigation) {
      navigate(href)
    }
  }

  return (
    <Flex
      testID="stop-card"
      flex={1}
      flexDirection="row"
      alignItems="center"
      backgroundColor="mono0"
      borderRadius={CARD_RADIUS}
      // `minHeight`, not `height`: every card — with or without an image — lines up at the
      // same height, but larger accessibility text sizes can still grow it past that floor
      // instead of being clipped to it. The image (below) is kept in sync with this via
      // `textHeight`, so it always covers the card's full height, not just the design floor.
      minHeight={cardHeight}
      style={{
        ...CARD_SHADOW,
        shadowColor: color("mono100"),
      }}
    >
      {/*
        Only the image and text are tappable. The save control renders inside this same card,
        but outside the touchable, so tapping it saves rather than navigating.
      */}
      <Touchable
        testID="stop-card-link"
        accessibilityLabel={accessibilityLabel}
        style={ROW_STYLE}
        onPress={handlePress}
      >
        <Flex flexDirection="row">
          {/* Flush with the card's left edge — no padding, and only the two left corners
              rounded, to match its own top-left/bottom-left. */}
          {!!image?.url && (
            <Image
              testID="stop-card-image"
              src={image.url}
              blurhash={image.blurhash}
              width={IMAGE_WIDTH}
              height={cardHeight}
              resizeMode="cover"
              style={{ borderTopLeftRadius: CARD_RADIUS, borderBottomLeftRadius: CARD_RADIUS }}
            />
          )}

          {/*
            An event's kind ("Closing Reception") sits above the title as its own eyebrow line;
            everything else is per the designs: what it is, where it is, then hours and
            admission separated by a dot. Which of them are filled depends on what the stop
            resolved to — see `stopCardFields`.
          */}
          <Flex
            flex={1}
            justifyContent="center"
            gap={0.5}
            py={0.5}
            pl={1}
            pr={0.5}
            onLayout={(event) => {
              const measured = event.nativeEvent.layout.height

              if (measured > textHeight) setTextHeight(measured)
            }}
          >
            {!!card.eventKind && <TypeEyebrow>{card.eventKind}</TypeEyebrow>}

            <Text variant="sm-display" numberOfLines={2} ellipsizeMode="tail">
              {card.title}
            </Text>

            {!!card.subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={1} ellipsizeMode="tail">
                {card.subtitle}
              </Text>
            )}

            {(!!card.hours || !!card.admission) && (
              <Flex flexDirection="row" alignItems="center" gap={0.5}>
                {!!card.hours && (
                  <Text variant="xs" color="mono60">
                    {card.hours}
                  </Text>
                )}

                {/* The designs separate the two with a 4pt dot, shown only when both are there. */}
                {!!card.hours && !!card.admission && (
                  <Flex
                    testID="stop-card-meta-dot"
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    borderRadius={DOT_SIZE / 2}
                    backgroundColor="mono60"
                  />
                )}

                {!!card.admission && (
                  <Text variant="xs" color="mono60">
                    {card.admission}
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Touchable>

      {!!saveControl && (
        <Flex justifyContent="center" pr={1}>
          {saveControl}
        </Flex>
      )}
    </Flex>
  )
}
