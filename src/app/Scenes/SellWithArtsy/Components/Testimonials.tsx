import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { useSWALandingPageData } from "app/Scenes/SellWithArtsy/utils/useSWALandingPageData"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { useCallback, useRef, useState } from "react"
import { FlatList, Image } from "react-native"
import { isTablet } from "react-native-device-info"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated"

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const {
    data: { testimonials },
    loading,
  } = useSWALandingPageData()

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

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!testimonials) {
    return null
  }

  return (
    <Flex>
      <FlatList
        data={testimonials}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.reviewText}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item }) => {
          return (
            <Flex width={width} pl={2} alignItems="center">
              <Flex pr={1} mb={4}>
                <Text variant="md" textAlign="center">{`"${item.reviewText}"`}</Text>
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
                    {item.gallery}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )
        }}
      />
      <Flex mx={2} mt={2} alignItems="center">
        <Indicator total={testimonials.length} currentIndex={currentIndex} />
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
  const SIZE = isTablet() ? 10 : 7
  const activeColor = color("black60")
  const inactiveColor = color("black15")

  const isActive = useDerivedValue(() => {
    if (currentIndex === index) {
      return withTiming(1)
    }

    return withTiming(0)
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

const LoadingSkeleton = () => {
  const { width } = useScreenDimensions()
  const color = useColor()
  return (
    <Flex mt={1}>
      <Flex width={width} pl={2} alignItems="center">
        <Flex pr={1} mb={4}>
          <PlaceholderText width="80%" />
          <PlaceholderText width="95%" />
          <PlaceholderText width="79%" />
          <PlaceholderText />
          <PlaceholderText width="50%" />
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          <PlaceholderBox
            width={50}
            height={50}
            borderRadius={50}
            backgroundColor={color("black30")}
          />

          <Flex ml={1}>
            <PlaceholderText />
            <PlaceholderText />
          </Flex>
        </Flex>
      </Flex>

      <Flex mx={2} mt={2} alignItems="center">
        <Indicator total={[1, 2, 3].length} currentIndex={0} />
      </Flex>
    </Flex>
  )
}
