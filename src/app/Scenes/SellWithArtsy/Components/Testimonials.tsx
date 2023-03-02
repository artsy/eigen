import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { useCallback, useRef, useState } from "react"
import { FlatList, Image } from "react-native"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated"
import { useScreenDimensions } from "shared/hooks"

interface ReviewsData {
  reviewText: string
  image: string // TODO:
  reviewerName: string
  galery: string
}

const REVIEWS: ReviewsData[] = [
  {
    reviewText:
      "My specialist kept me transparently informed from our initial conversation throughout. They took care of everything smoothly - from finding the right buyer to taking care of shipping and final payment.",
    image: "image",
    reviewerName: "Joe Bloggs",
    galery: "White Cube Gallery",
  },
  {
    reviewText:
      "2 My specialist kept me transparently informed from our initial conversation throughout. They took care of everything smoothly - from finding the right buyer to taking care of shipping and final payment.",
    image: "image",
    reviewerName: "Joe Bloggs",
    galery: "White Cube Gallery",
  },
  {
    reviewText:
      "3 My specialist kept me transparently informed from our initial conversation throughout. They took care of everything smoothly - from finding the right buyer to taking care of shipping and final payment.",
    image: "image",
    reviewerName: "Joe Bloggs",
    galery: "White Cube Gallery",
  },
]

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currIndex = viewableItems[0].index
      setCurrentIndex(currIndex)
    }
  }, [])

  const viewabilityConfig = {
    // 50% because we want the indicators to snap faster to the right index when dragged.
    // with a higher threshhold it can feel like the indicators are slow. Feel free to adjust
    viewAreaCoveragePercentThreshold: 50,
  }

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

  const color = useColor()
  const { width } = useScreenDimensions()
  const isAPad = isPad()

  return (
    <Flex mt={1}>
      <FlatList
        data={REVIEWS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.reviewText}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item }) => {
          return (
            <Flex width={width} pl={2} alignItems={isAPad ? "center" : undefined}>
              <Flex pr={1} mb={4}>
                <Text variant="md">{`"${item.reviewText}"`}</Text>
              </Flex>
              <Flex flexDirection="row" alignItems="center">
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundColor: color("black30"),
                  }}
                />
                <Flex ml={1}>
                  <Text variant="xs">{item.reviewerName}</Text>
                  <Text variant="xs" color="black60">
                    {item.galery}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )
        }}
      />
      <Flex mx={2} mt={2} alignItems={isAPad ? "center" : undefined}>
        <Indicator total={REVIEWS.length} currentIndex={currentIndex} />
      </Flex>
    </Flex>
  )
}

const Indicator: React.FC<{ total: number; currentIndex: number }> = ({ total, currentIndex }) => {
  return (
    <>
      <Spacer y={2} />
      <Flex flexDirection="row">
        {Array(total)
          .fill(null)
          .map((_, index) => (
            <Dot currentIndex={currentIndex} key={index} index={index} />
          ))}
      </Flex>
    </>
  )
}

const Dot: React.FC<{ currentIndex: number; index: number }> = ({ currentIndex, index }) => {
  const color = useColor()
  const SIZE = isPad() ? 10 : 7
  const activeColor = color("black60")
  const inactiveColor = color("black15")

  const isActive = useDerivedValue(() => {
    return withTiming(currentIndex === index ? 1 : 0)
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(isActive.value, [0, 1], [inactiveColor, activeColor]),
    }
  })

  return (
    <Animated.View
      testID="Testimonial-Pagination-Dot"
      accessibilityLabel="Testimonial Pagination Indicator"
      style={[
        {
          marginHorizontal: SIZE * 0.8,
          borderRadius: SIZE / 2,
          width: SIZE,
          height: SIZE,
        },
        animatedStyle,
      ]}
    />
  )
}
