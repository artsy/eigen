import { CheckmarkFillIcon, IconProps } from "@artsy/icons/native"
import { Flex, Pill, PillVariant } from "@artsy/palette-mobile"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { MotiPressableProps } from "moti/interactions"
import { Platform } from "react-native"
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

export const PillCheckmarkIcon = () => (
  <Flex pr={Platform.OS === "android" ? 1 : 0} mr={0.5}>
    <CheckmarkFillIcon
      fill="mono0"
      height={ACCESSIBLE_DEFAULT_ICON_SIZE}
      width={ACCESSIBLE_DEFAULT_ICON_SIZE}
    />
  </Flex>
)

export const PillIconPlaceholder = () => (
  <Flex width={0} height={ACCESSIBLE_DEFAULT_ICON_SIZE} overflow="hidden" />
)

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
