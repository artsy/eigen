import { Pill, PillProps } from "palette"
import Animated, { FadeInUp, FadeOutDown, Layout } from "react-native-reanimated"

interface FadingPillProps extends PillProps {
  isVisible: boolean
}

export const FADE_OUT_PILL_ANIMATION_DURATION = 500

export const AnimatedFadingPill: React.FC<FadingPillProps> = ({ isVisible, ...rest }) => {
  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown} layout={Layout}>
      {!!isVisible && <Pill {...rest}>{rest.children}</Pill>}
    </Animated.View>
  )
}
