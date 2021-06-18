import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, FilterIcon, Flex, Separator, Text, TouchableHighlightColor } from "palette"
import React, { useEffect, useState } from "react"
import { Animated, Dimensions, LayoutChangeEvent, PixelRatio } from "react-native"

interface FilterProps {
  total: number
  animationValue: Animated.Value
  onPress: () => void
}

const pixelRatio = PixelRatio.get()
// values based on px used in <BackButton>
const BACK_BUTTON_SIZE = {
  top: isPad() ? 10 / pixelRatio : 14 / pixelRatio,
  left: isPad() ? 20 / pixelRatio : 10 / pixelRatio,
  right: 0,
  bottom: 0,
  image: {
    height: 40,
    width: 40,
  },
}

export const HeaderArtworksFilter: React.FC<FilterProps> = ({ total, animationValue, onPress }) => {
  const screenWidth = useScreenDimensions().width

  const [onLayoutCalled, setOnLayoutCalled] = useState(false)
  const [filterPageY, setPageY] = useState(0)

  useEffect(() => {
    // orientation changed, allow for recalculation of pageY
    Dimensions.addEventListener("change", orientationChanged)
    return () => {
      Dimensions.removeEventListener("change", orientationChanged)
    }
  }, [])

  const orientationChanged = () => {
    setOnLayoutCalled(false)
  }

  const _onLayout = (event: LayoutChangeEvent) => {
    // because onLayout can be called multiple times on android
    if (onLayoutCalled) {
      return
    }
    // @ts-ignore
    event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setPageY(pageY)
    })
    setOnLayoutCalled(true)
  }

  const extraOffset = 1
  const topInset = useScreenDimensions().safeAreaInsets.top

  const ANIM_START = BACK_BUTTON_SIZE.image.height * 2
  const TRANSLATE_X_VALUE = BACK_BUTTON_SIZE.image.width
  const TRANSLATE_Y_VALUE =
    topInset -
    BACK_BUTTON_SIZE.image.height / 2 -
    BACK_BUTTON_SIZE.top -
    PixelRatio.getPixelSizeForLayoutSize(extraOffset)

  const SeparatorWithSmoothOpacity = () => {
    return (
      <Animated.View
        style={{
          opacity: animationValue.interpolate({
            inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
            outputRange: filterPageY > 0 ? [1, 0, 0] : [1, 1, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        <Separator mt={2} width={screenWidth * 2} />
      </Animated.View>
    )
  }

  if (!total) {
    return <SeparatorWithSmoothOpacity />
  }

  return (
    <Box backgroundColor="white" onLayout={(e) => _onLayout(e)}>
      <SeparatorWithSmoothOpacity />
      <Animated.View
        style={{
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
                outputRange: filterPageY > 0 ? [0, 0, TRANSLATE_Y_VALUE] : [0, 0, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <Box backgroundColor="white" mt={3} px={2} mb={3}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: animationValue.interpolate({
                      inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
                      outputRange: filterPageY > 0 ? [0, 0, TRANSLATE_X_VALUE] : [0, 0, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              {!!total && (
                <Text variant="subtitle" color="black60">
                  Showing {total} works
                </Text>
              )}
            </Animated.View>
            {!!total && (
              <TouchableHighlightColor
                haptic
                onPress={onPress}
                render={({ color }) => (
                  <Flex flexDirection="row" alignItems="center">
                    <FilterIcon fill={color} width="20px" height="20px" />
                    <Text variant="subtitle" color={color}>
                      Sort & Filter
                    </Text>
                  </Flex>
                )}
              />
            )}
          </Flex>
        </Box>
      </Animated.View>
    </Box>
  )
}
