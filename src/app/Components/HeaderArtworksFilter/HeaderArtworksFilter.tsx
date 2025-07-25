import { FilterIcon } from "@artsy/icons/native"
import { Flex, Box, Text, Separator, TouchableHighlightColor } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useEffect, useState } from "react"
import { Animated, Dimensions, LayoutChangeEvent, PixelRatio } from "react-native"
import { isTablet } from "react-native-device-info"

export interface FilterProps {
  animationValue?: Animated.Value
  disableYAxisAnimation?: boolean
  hideArtworksCount?: boolean
  onPress: () => void
  total: number
}

interface SeparatorWithSmoothOpacityProps {
  animationValue: Animated.Value
  filterPageY: number
  screenWidth: number
}

const pixelRatio = PixelRatio.get()
// values based on px used in <BackButton>
const BACK_BUTTON_SIZE = {
  top: isTablet() ? 10 / pixelRatio : 14 / pixelRatio,
  left: isTablet() ? 20 / pixelRatio : 10 / pixelRatio,
  right: 0,
  bottom: 0,
  image: {
    height: 40,
    width: 40,
  },
}

const ANIM_START = BACK_BUTTON_SIZE.image.height * 2

export const SeparatorWithSmoothOpacity: React.FC<SeparatorWithSmoothOpacityProps> = ({
  animationValue,
  filterPageY,
  screenWidth,
}) => {
  return (
    <Animated.View
      style={{
        opacity:
          animationValue?.interpolate({
            inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
            outputRange: filterPageY > 0 ? [1, 0, 0] : [1, 1, 1],
            extrapolate: "clamp",
          }) ?? 0,
      }}
    >
      <Separator mt={2} width={screenWidth * 2} />
    </Animated.View>
  )
}

export const HeaderArtworksFilter: React.FC<FilterProps> = ({
  animationValue,
  disableYAxisAnimation,
  hideArtworksCount,
  onPress,
  total,
}) => {
  const screenWidth = useScreenDimensions().width

  const [onLayoutCalled, setOnLayoutCalled] = useState(false)
  const [filterPageY, setPageY] = useState(0)

  useEffect(() => {
    // orientation changed, allow for recalculation of pageY
    const dimensionsEventSubscription = Dimensions.addEventListener("change", orientationChanged)
    return () => dimensionsEventSubscription.remove()
  }, [])

  const orientationChanged = () => {
    setOnLayoutCalled(false)
  }

  const _onLayout = (event: LayoutChangeEvent) => {
    // because onLayout can be called multiple times on android
    if (!animationValue || onLayoutCalled) {
      return
    }
    // @ts-ignore
    event.target.measure(
      // @ts-ignore
      (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setPageY(pageY)
      }
    )
    setOnLayoutCalled(true)
  }

  const extraOffset = 1
  const topInset = useScreenDimensions().safeAreaInsets.top

  const TRANSLATE_X_VALUE = BACK_BUTTON_SIZE.image.width
  const TRANSLATE_Y_VALUE =
    topInset -
    BACK_BUTTON_SIZE.image.height / 2 -
    BACK_BUTTON_SIZE.top -
    PixelRatio.getPixelSizeForLayoutSize(extraOffset)

  const separatorProps = {
    animationValue: animationValue as Animated.Value,
    filterPageY,
    screenWidth,
  }

  return (
    <Box backgroundColor="mono0" onLayout={(e) => _onLayout(e)} testID="HeaderArtworksFilter">
      {!!animationValue && !disableYAxisAnimation && (
        <SeparatorWithSmoothOpacity {...separatorProps} />
      )}
      {!!total && (
        <Animated.View
          style={{
            transform: [
              {
                translateY: !disableYAxisAnimation
                  ? animationValue?.interpolate({
                      inputRange:
                        filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
                      outputRange: filterPageY > 0 ? [0, 0, TRANSLATE_Y_VALUE] : [0, 0, 0],
                      extrapolate: "clamp",
                    }) ?? 0
                  : 0,
              },
            ],
          }}
        >
          <Flex backgroundColor="mono0" height={50} px={2} justifyContent="center">
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              {hideArtworksCount ? (
                <Flex />
              ) : (
                <Animated.View
                  style={{
                    transform: [
                      {
                        translateX:
                          animationValue?.interpolate({
                            inputRange:
                              filterPageY > 0
                                ? [0, filterPageY - ANIM_START, filterPageY]
                                : [0, 0, 0],
                            outputRange: filterPageY > 0 ? [0, 0, TRANSLATE_X_VALUE] : [0, 0, 0],
                            extrapolate: "clamp",
                          }) ?? 0,
                      },
                    ],
                  }}
                >
                  <Text variant="sm-display" color="mono60">
                    Showing {total} works
                  </Text>
                </Animated.View>
              )}

              <TouchableHighlightColor
                haptic
                onPress={onPress}
                render={({ color }) => (
                  <Flex flexDirection="row" alignItems="center">
                    <FilterIcon fill={color} width="20px" height="20px" />
                    <Text variant="sm-display" color={color}>
                      Sort & Filter
                    </Text>
                  </Flex>
                )}
              />
            </Flex>
          </Flex>
        </Animated.View>
      )}
    </Box>
  )
}
