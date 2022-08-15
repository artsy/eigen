import { Box, Pill, PillProps } from "palette"
import { useEffect, useRef, useState } from "react"
import { Animated } from "react-native"

interface FadingPillProps extends PillProps {
  isVisible: boolean
}

const AnimatedBox = Animated.createAnimatedComponent(Box)

export const FADE_OUT_PILL_ANIMATION_DURATION = 500

export const AnimatedFadingPill: React.FC<FadingPillProps> = ({ isVisible, ...rest }) => {
  const [visible, setIsVisible] = useState(isVisible)
  const visibility = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!isVisible) {
      Animated.timing(visibility, {
        toValue: 0,
        duration: FADE_OUT_PILL_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => setIsVisible(false))
    }
  }, [isVisible])

  const containerStyle = {
    opacity: visibility.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }

  return (
    <AnimatedBox style={containerStyle}>
      {!!visible && <Pill {...rest}>{rest.children}</Pill>}
    </AnimatedBox>
  )
}
