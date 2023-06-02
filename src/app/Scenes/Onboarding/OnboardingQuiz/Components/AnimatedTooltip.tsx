import { Flex, useSpace, Text } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { useEffect, useRef, useState } from "react"
import { Animated, Easing, Image, TouchableOpacity } from "react-native"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const ANIMATION_DELAY = 600
const ANIMATION_DURATION = 300

export const AnimatedTooltip: React.FC = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)
  const { width } = useScreenDimensions()
  const leftPosition = useRef(new Animated.Value(0)).current
  const space = useSpace()

  const pushRightAnimation = () => {
    Animated.timing(leftPosition, {
      delay: ANIMATION_DELAY,
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    pushRightAnimation()
  }, [])

  const xVal = leftPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  })

  if (!isTooltipVisible) {
    return null
  }

  return (
    <AnimatedFlex
      alignItems="center"
      py={1}
      px={2}
      backgroundColor="black100"
      style={{
        transform: [
          {
            translateX: xVal,
          },
        ],
      }}
    >
      <Text variant="xs" color="white100">
        Find your Saves and Follows in your settings.
      </Text>
      <Flex position="absolute" height="100%" top={space(1)} right={space(2)}>
        <TouchableOpacity
          style={{ alignContent: "flex-end" }}
          hitSlop={{ bottom: 40, right: 40, left: 40, top: 40 }}
          onPress={() => setIsTooltipVisible(false)}
        >
          <Image source={require("images/close-x.webp")} />
        </TouchableOpacity>
      </Flex>
    </AnimatedFlex>
  )
}
