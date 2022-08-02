import { Flex, Text, useSpace } from "palette"
import { useEffect, useRef, useState } from "react"
import { Animated, Easing, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useScreenDimensions } from "shared/hooks"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

export const AnimatedTooltip: React.FC = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)
  const { width } = useScreenDimensions()
  const leftPosition = useRef(new Animated.Value(0)).current
  const space = useSpace()

  const pushRightAnimation = () => {
    Animated.timing(leftPosition, {
      delay: 500,
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.linear),
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
      flexDirection="row"
      justifyContent="center"
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
      <TouchableOpacity
        style={{ position: "absolute", top: space(1), right: space(2) }}
        hitSlop={{ bottom: 40, right: 40, left: 40, top: 40 }}
        onPress={() => setIsTooltipVisible(false)}
      >
        <Image source={require("images/close-x.webp")} />
      </TouchableOpacity>
    </AnimatedFlex>
  )
}
