import { IconProps } from "@artsy/icons/native"
import { Pill, PillVariant } from "@artsy/palette-mobile"
import { MotiPressableProps } from "moti/interactions"
import Animated, { FadeInUp, FadeOutDown, Layout } from "react-native-reanimated"

interface FadingPillProps {
  variant?: Extract<PillVariant, "default" | "filter" | "badge" | "search" | "dotted">
  src?: never
  selected?: boolean
  disabled?: boolean
  Icon?: React.FC<IconProps>
  onPress?: MotiPressableProps["onPress"]
  isVisible: boolean
}

export const FADE_OUT_PILL_ANIMATION_DURATION = 500

export const AnimatedFadingPill: React.FC<React.PropsWithChildren<FadingPillProps>> = ({
  isVisible,
  ...rest
}) => {
  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown} layout={Layout}>
      {!!isVisible && (
        <Pill {...rest} variant="onboarding" alignSelf="flex-start">
          {rest.children}
        </Pill>
      )}
    </Animated.View>
  )
}
