import {
  BackButton,
  Flex,
  Separator,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { TEXT_VARIANTS } from "@artsy/palette-tokens/dist/typography/v3"
import { useMeasure } from "app/utils/hooks/useMeasure"
import { useMemo, useRef } from "react"
import { View } from "react-native"
import Animated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const DYNAMIC_CONTENT_HEIGHT_MAX = 120
const DYNAMIC_CONTENT_HEIGHT_MIN = 56
const STICKY_CONTENT_HEIGHT = 50
const DYNAMIC_CONTENT_TITLE_FONT_SIZE = parseInt(TEXT_VARIANTS["lg-display"].fontSize, 10)
const NAVIGATION_TITLE_FONT_SIZE = parseInt(TEXT_VARIANTS["sm"].fontSize, 10)
const DYNAMIC_CONTENT_TITLE_INCREASE_SIZE = 4

const HORIZONTAL_PADDING = 20

export const useFancyHeader = ({
  title = "Activity",
  rightButton,
  stickyContent,
}: {
  title: string
  rightButton: JSX.Element
  stickyContent?: JSX.Element
}) => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()

  const titleRef = useRef<Text>(null)

  const isScrolling = useSharedValue(false)
  const lastContentOffset = useSharedValue(0)

  const flatlistTopPadding = useSharedValue(DYNAMIC_CONTENT_HEIGHT_MAX + STICKY_CONTENT_HEIGHT)

  const dynamicContentHeight = useSharedValue(DYNAMIC_CONTENT_HEIGHT_MAX)
  const dynamicContentTitleSize = useSharedValue(DYNAMIC_CONTENT_TITLE_FONT_SIZE)
  const dynamicContentTitleLeft = useSharedValue(0)

  const { width: titleWidth } = useMeasure({ ref: titleRef })

  const expandDynamicContentWorklet = () => {
    "worklet"
    dynamicContentHeight.value = DYNAMIC_CONTENT_HEIGHT_MAX
    flatlistTopPadding.value = DYNAMIC_CONTENT_HEIGHT_MAX + STICKY_CONTENT_HEIGHT
    dynamicContentTitleLeft.value = 0
    dynamicContentTitleSize.value = DYNAMIC_CONTENT_TITLE_FONT_SIZE

    // Increase the dynamic content title size when the user scroll to the top of the screen
    if (
      dynamicContentTitleSize.value === DYNAMIC_CONTENT_TITLE_FONT_SIZE &&
      // This is needed to prevent the title size from increasing when the screen clamps to the top
      isScrolling.value
    ) {
      dynamicContentTitleSize.value =
        DYNAMIC_CONTENT_TITLE_FONT_SIZE + DYNAMIC_CONTENT_TITLE_INCREASE_SIZE
    }
  }

  const collapseDynamicContentWorklet = () => {
    "worklet"
    dynamicContentHeight.value = DYNAMIC_CONTENT_HEIGHT_MIN
    flatlistTopPadding.value = DYNAMIC_CONTENT_HEIGHT_MIN + STICKY_CONTENT_HEIGHT

    // Translate the dynamic content title to the middle of the screen
    dynamicContentTitleLeft.value = !!titleWidth
      ? (screenWidth - titleWidth) / 2 - HORIZONTAL_PADDING
      : 0

    dynamicContentTitleSize.value = NAVIGATION_TITLE_FONT_SIZE
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // When the user scroll to the top of the screen
      if (event.contentOffset.y <= 0) {
        // Show the dynamic content
        expandDynamicContentWorklet()
      }

      if (lastContentOffset.value < event.contentOffset.y && isScrolling.value) {
        collapseDynamicContentWorklet()
      }
      lastContentOffset.value = event.contentOffset.y
    },
    onBeginDrag: () => {
      isScrolling.value = true
    },
    onEndDrag: () => {
      isScrolling.value = false
      // Reset the dynamic content title size to the default size
      if (dynamicContentTitleSize.value > DYNAMIC_CONTENT_TITLE_FONT_SIZE) {
        dynamicContentTitleSize.value = DYNAMIC_CONTENT_TITLE_FONT_SIZE
      }
    },
  })

  const dynamicContentStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(dynamicContentHeight.value),
    }
  })

  const dynamicContentTitleStyle = useAnimatedStyle(() => {
    return {
      fontSize: withTiming(dynamicContentTitleSize.value),
      left: withTiming(dynamicContentTitleLeft.value),
    }
  })

  const animatedFlatlistProps = useAnimatedProps(() => {
    return {
      flex: 1,
      transform: [{ translateY: withTiming(flatlistTopPadding.value) }],
      paddingBottom: 110, // Make sure the last element of the flatlist are visible
    }
  })

  const stickyContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(dynamicContentHeight.value) }],
    }
  })

  const stickyContentElement = useMemo(() => {
    if (!stickyContent) {
      return null
    }
    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            height: STICKY_CONTENT_HEIGHT,
            justifyContent: "center",
          },
          stickyContentStyle,
        ]}
      >
        {stickyContent}
        <Separator borderColor="black5" />
      </Animated.View>
    )
  }, [stickyContent, stickyContentStyle])

  const headerElement = useMemo(
    () => (
      <>
        <Animated.View
          style={[
            {
              width: "100%",
              position: "absolute",
              paddingHorizontal: space(2),
              flexDirection: "row",
              alignItems: "flex-end",
            },
            dynamicContentStyle,
          ]}
        >
          <AnimatedText color="black100" style={dynamicContentTitleStyle} lineHeight="50px">
            {title}
          </AnimatedText>
          {/* This is used to calculate the center position we need to snap to */}
          <Text
            color="transparent"
            fontSize={NAVIGATION_TITLE_FONT_SIZE}
            ref={titleRef as any}
            style={{ position: "absolute" }}
          >
            {title}
          </Text>
        </Animated.View>
        <BackButton style={{ position: "absolute", top: space(2), left: space(2) }} />
        {!!rightButton && (
          <Flex position="absolute" top={2} right={2}>
            {rightButton}
          </Flex>
        )}
      </>
    ),
    [title, rightButton, dynamicContentStyle, dynamicContentTitleStyle]
  )

  const FlatlistContainerElement: React.FC = ({ children }) => {
    return <Animated.View style={animatedFlatlistProps}>{children}</Animated.View>
  }

  return {
    headerElement,
    stickyContentElement,
    scrollHandler,
    FlatlistContainerElement,
    StatusBarOverlay,
  }
}

// Useful to avoid having content behind the status bar
const StatusBarOverlay = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        height: 100,
        position: "absolute",
        width: "100%",
        transform: [{ translateY: -100 }],
      }}
    />
  )
}

const AnimatedText = Animated.createAnimatedComponent(Text)
