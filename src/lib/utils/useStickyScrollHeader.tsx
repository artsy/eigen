import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Flex, Text } from "palette"
import React, { useMemo, useRef } from "react"
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from "react-native"

const DEFAULT_FADE_IN_START = 90
const FADE_LENGTH = 10

export const useStickyScrollHeader = ({
  header,
  headerText,
  fadeInStart = DEFAULT_FADE_IN_START,
  fadeInEnd,
}: {
  header?: JSX.Element
  headerText?: string
  fadeInStart?: number
  fadeInEnd?: number
}) => {
  const scrollAnim = new Animated.Value(0)
  const snapAnim = new Animated.Value(0)
  const scrollEndTimer = useRef(setTimeout(() => null, 0))
  const translateYNumber = useRef(0)
  scrollAnim.addListener(({ value }) => {
    translateYNumber.current = value
  })
  const calculatedFadeInEnd: number = !!fadeInEnd ? fadeInEnd : fadeInStart + FADE_LENGTH
  header =
    !header && !!headerText ? (
      <Flex backgroundColor="white">
        <FancyModalHeader>
          <Flex flex={1} pt={0.5} flexDirection="row">
            <Text variant="subtitle" numberOfLines={1} style={{ flexShrink: 1 }}>
              {headerText}
            </Text>
          </Flex>
        </FancyModalHeader>
      </Flex>
    ) : (
      <Flex backgroundColor="white">
        <FancyModalHeader>{header}</FancyModalHeader>
      </Flex>
    )

  const headerElement = useMemo(
    () => (
      <Animated.View
        pointerEvents={
          translateYNumber?.current !== undefined && translateYNumber.current < fadeInStart ? undefined : "none"
        }
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          opacity: Animated.add(scrollAnim, snapAnim).interpolate({
            inputRange: [fadeInStart, calculatedFadeInEnd],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        {header}
      </Animated.View>
    ),
    [header, scrollAnim]
  )

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollAnim },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  )

  const handleSnap = (offsetY: number) => {
    if (offsetY > fadeInStart && offsetY < calculatedFadeInEnd) {
      const toValue =
        offsetY - fadeInStart < (calculatedFadeInEnd - fadeInStart) / 2
          ? fadeInStart - offsetY
          : calculatedFadeInEnd - offsetY
      Animated.timing(snapAnim, {
        toValue,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }
  }

  // nasty workaround to figure out scrollEnd
  // https://medium.com/appandflow/react-native-collapsible-navbar-e51a049b560a
  const onScrollEndDrag = (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = evt.nativeEvent.contentOffset.y
    scrollEndTimer.current = setTimeout(() => {
      handleSnap(offsetY)
    }, 250)
  }

  return {
    headerElement,
    scrollProps: {
      onMomentumScrollBegin: () => {
        if (scrollEndTimer.current !== undefined) {
          clearTimeout(scrollEndTimer.current)
        }
      },
      onMomentumScrollEnd: (evt: NativeSyntheticEvent<NativeScrollEvent>) =>
        handleSnap(evt.nativeEvent.contentOffset.y),
      onScroll,
      onScrollEndDrag,
      scrollEventThreshold: 100,
    },
    scrollAnim,
  }
}
