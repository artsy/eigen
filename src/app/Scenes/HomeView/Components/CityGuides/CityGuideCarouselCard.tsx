import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import {
  CITY_GUIDE_CARD_HEIGHT,
  CITY_GUIDE_CARD_WIDTH,
  CITY_GUIDE_ITEM_WIDTH,
  SIDE_CARD_DIM_OPACITY,
  SIDE_CARD_SCALE,
} from "app/Scenes/HomeView/Components/CityGuides/cityGuidesCarousel"
import { RouterLink } from "app/system/navigation/RouterLink"
import { memo, useCallback } from "react"
import { StyleSheet } from "react-native"
import Animated, { SharedValue, interpolate, useAnimatedStyle } from "react-native-reanimated"

const CARD_PADDING = 14
const CONTENT_WIDTH = CITY_GUIDE_CARD_WIDTH - CARD_PADDING * 2
const CITY_IMAGE_HEIGHT = 76
const NEAR_ME_IMAGE_HEIGHT = 90
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
  isCentered: boolean
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
  ({ card, index, isCentered, position, onPress }) => {
    const color = useColor()
    const isNearMe = !card.citySlug

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
      <Flex width={CITY_GUIDE_ITEM_WIDTH} alignItems="center">
        <Animated.View
          style={[styles.card, { backgroundColor: color("mono0") }, cardStyle]}
          testID={`city-guide-card-${card.citySlug ?? "near-me"}`}
        >
          <RouterLink
            to={card.href}
            disableNavigation={!isCentered}
            // The route has no prefetch queries, and each card would mount a visibility sentinel
            disablePrefetch
            onPress={handlePress}
            accessibilityRole={isCentered ? "link" : "button"}
            accessibilityLabel={
              isCentered ? `Open the ${card.title} City Guide` : `Show ${card.title}`
            }
            style={styles.content}
          >
            {isNearMe ? <NearMeContent card={card} /> : <CityContent card={card} />}
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

const CityContent: React.FC<{ card: CityGuideCarouselCardData }> = ({ card }) => {
  return (
    <>
      <Text variant="lg-display" numberOfLines={1}>
        {card.title}
      </Text>

      {!!card.image?.imageURL && (
        <Flex mt={1}>
          <Image
            src={card.image.imageURL}
            width={CONTENT_WIDTH}
            height={CITY_IMAGE_HEIGHT}
            style={styles.image}
          />
        </Flex>
      )}

      <Flex flexDirection="row" alignItems="center" mt={1}>
        <Flex flex={1} flexDirection="row" alignItems="center" overflow="hidden">
          {card.chips.map((chip) => (
            <Flex
              key={chip}
              backgroundColor="mono5"
              borderRadius={13}
              height={26}
              px="8px"
              mr="6px"
              justifyContent="center"
            >
              <Text variant="xxs" numberOfLines={1}>
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

const NearMeContent: React.FC<{ card: CityGuideCarouselCardData }> = ({ card }) => {
  return (
    <Flex flex={1} justifyContent="space-between">
      <Flex maxWidth={150}>
        <Text variant="lg-display" numberOfLines={2}>
          {card.title}
        </Text>
      </Flex>

      {!!card.image?.imageURL && (
        <Flex>
          <Image
            src={card.image.imageURL}
            width={CONTENT_WIDTH}
            height={NEAR_ME_IMAGE_HEIGHT}
            style={styles.image}
          />

          <Flex style={styles.nearMeArrow}>
            <Arrow />
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

/** Decorative: the whole card is the touch target */
const Arrow: React.FC = () => {
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
      <ChevronSmallRightIcon fill="mono0" width={18} height={18} />
    </Flex>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CITY_GUIDE_CARD_WIDTH,
    height: CITY_GUIDE_CARD_HEIGHT,
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
