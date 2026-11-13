import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Flex, Image, Spinner, Text, useColor } from "@artsy/palette-mobile"
import {
  SIDE_CARD_DIM_OPACITY,
  SIDE_CARD_SCALE,
} from "app/Scenes/HomeView/Components/CityGuides/cityGuidesCarousel"
import { RouterLink } from "app/system/navigation/RouterLink"
import { memo, useCallback, useState } from "react"
import { LayoutChangeEvent, StyleSheet } from "react-native"
import Animated, { SharedValue, interpolate, useAnimatedStyle } from "react-native-reanimated"

const CARD_PADDING = 14
const CITY_IMAGE_HEIGHT = 80
/** The near-me image fills what's left of the card, but never shrinks below this */
const NEAR_ME_IMAGE_MIN_HEIGHT = 60
const ARROW_SIZE = 30

export interface CityGuideCarouselCardData {
  citySlug: string | null | undefined
  title: string
  href: string
  chips: ReadonlyArray<string>
  image: { imageURL: string | null | undefined } | null | undefined
}

interface CityGuideCarouselCardProps {
  card: CityGuideCarouselCardData
  /** Index in the (looped) list */
  index: number
  cardWidth: number
  /** Width of the list item holding the card, see `getCityGuideItemWidth` */
  itemWidth: number
  isCentered: boolean
  /** The near-me card is waiting on location access and the device position */
  isLoading?: boolean
  /** Scroll position in item units */
  position: SharedValue<number>
  onPress: (card: CityGuideCarouselCardData, index: number, isCentered: boolean) => void
}

/**
 * A card in the City Guides rail. The centered card opens its City Guide; a side card is brought
 * to the center first. Its scale and dimming are driven by the scroll position on the UI thread,
 * so swiping never re-renders it.
 */
export const CityGuideCarouselCard: React.FC<CityGuideCarouselCardProps> = memo(
  ({ card, index, cardWidth, itemWidth, isCentered, isLoading = false, position, onPress }) => {
    const color = useColor()
    const isNearMe = !card.citySlug
    const contentWidth = cardWidth - CARD_PADDING * 2

    const cardStyle = useAnimatedStyle(() => {
      const distance = Math.min(Math.abs(position.value - index), 1)

      return { transform: [{ scale: interpolate(distance, [0, 1], [1, SIDE_CARD_SCALE]) }] }
    })

    const dimStyle = useAnimatedStyle(() => {
      const distance = Math.min(Math.abs(position.value - index), 1)

      return { opacity: distance * SIDE_CARD_DIM_OPACITY }
    })

    const handlePress = useCallback(
      () => onPress(card, index, isCentered),
      [onPress, card, index, isCentered]
    )

    return (
      // Horizontal list items stretch to the tallest one, and the card fills its item: all cards end
      // up as tall as the tallest content, with no fixed height
      <Flex width={itemWidth} alignItems="center">
        <Animated.View
          style={[styles.card, { width: cardWidth, backgroundColor: color("mono0") }, cardStyle]}
          testID={`city-guide-card-${card.citySlug ?? "near-me"}`}
        >
          <RouterLink
            to={card.href}
            // Side cards scroll to the center instead, and the near-me card navigates once it knows
            // the nearest city
            disableNavigation={!isCentered || isNearMe}
            // The route has no prefetch queries, and each card would mount a visibility sentinel
            disablePrefetch
            onPress={handlePress}
            accessibilityRole={isCentered ? "link" : "button"}
            accessibilityLabel={getAccessibilityLabel(card, isCentered)}
            accessibilityState={{ busy: isLoading }}
            style={styles.content}
          >
            {isNearMe ? (
              <NearMeContent card={card} contentWidth={contentWidth} isLoading={isLoading} />
            ) : (
              <CityContent card={card} contentWidth={contentWidth} />
            )}
          </RouterLink>

          <Animated.View
            pointerEvents="none"
            style={[styles.dim, { backgroundColor: color("mono100") }, dimStyle]}
          />
        </Animated.View>
      </Flex>
    )
  }
)

const getAccessibilityLabel = (card: CityGuideCarouselCardData, isCentered: boolean) => {
  if (!isCentered) return `Show ${card.title}`

  return card.citySlug
    ? `Open the ${card.title} City Guide`
    : "Open the City Guide for the city nearest to you"
}

interface ContentProps {
  card: CityGuideCarouselCardData
  contentWidth: number
}

const CityContent: React.FC<ContentProps> = ({ card, contentWidth }) => {
  return (
    <>
      <Text variant="xl" numberOfLines={1}>
        {card.title}
      </Text>

      {!!card.image?.imageURL && (
        <Flex mt={1}>
          <Image
            src={card.image.imageURL}
            width={contentWidth}
            height={CITY_IMAGE_HEIGHT}
            style={styles.image}
          />
        </Flex>
      )}

      <Flex flexDirection="row" alignItems="center" mt={1}>
        <Flex flex={1} flexDirection="row" alignItems="center" overflow="hidden" gap={1}>
          {card.chips.map((chip) => (
            <Flex
              py={0.5}
              px={1}
              key={chip}
              backgroundColor="mono5"
              borderRadius={10}
              justifyContent="center"
            >
              <Text variant="xs" numberOfLines={1}>
                {chip}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Arrow />
      </Flex>
    </>
  )
}

const NearMeContent: React.FC<ContentProps & { isLoading: boolean }> = ({
  card,
  contentWidth,
  isLoading,
}) => {
  // Measured, so the image fills the card down to where the city cards end, whatever the title's
  // line count or font scale
  const [imageHeight, setImageHeight] = useState(0)

  const handleImageAreaLayout = useCallback((event: LayoutChangeEvent) => {
    // Same-value updates are skipped, so this settles after the first layout
    setImageHeight(Math.round(event.nativeEvent.layout.height))
  }, [])

  return (
    <Flex flex={1}>
      <Text variant="xl" numberOfLines={2}>
        {card.title}
      </Text>

      {!!card.image?.imageURL && (
        <Flex flex={1} mt={1} minHeight={NEAR_ME_IMAGE_MIN_HEIGHT} onLayout={handleImageAreaLayout}>
          {imageHeight > 0 && (
            <Image
              src={card.image.imageURL}
              width={contentWidth}
              height={imageHeight}
              style={styles.image}
            />
          )}

          <Flex style={styles.nearMeArrow}>
            <Arrow isLoading={isLoading} />
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

/** Decorative: the whole card is the touch target */
const Arrow: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  return (
    <Flex
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      borderRadius={ARROW_SIZE / 2}
      backgroundColor="mono100"
      alignItems="center"
      justifyContent="center"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {isLoading ? (
        <Flex testID="city-guide-near-me-spinner" justifyContent="center" alignItems="center">
          <Spinner size="small" color="mono0" />
        </Flex>
      ) : (
        <ChevronSmallRightIcon fill="mono0" width={18} height={18} />
      )}
    </Flex>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 6,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: CARD_PADDING,
  },
  image: {
    borderRadius: 5,
  },
  dim: {
    ...StyleSheet.absoluteFill,
  },
  nearMeArrow: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
})
