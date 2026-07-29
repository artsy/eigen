import { Text, useColor } from "@artsy/palette-mobile"
import { useEffect } from "react"
import { Pressable } from "react-native"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const ANIMATION_DURATION = 200

// Color-state indices used with `interpolateColor` below.
const DISABLED = 0
const ENABLED = 1
const PRESSED = 2

interface FollowArtistsContinueButtonProps {
  disabled: boolean
  onPress: () => void
  testID?: string
  children: string
}

// A local, Reanimated-driven replacement for palette-mobile's <Button>, used only for this CTA.
// palette-mobile's <Button> animates via react-spring, which can get permanently stuck showing
// the wrong color when another Reanimated animation on this screen (StepProgressBar) fires from
// the same state change at the same time. This component avoids that by using Reanimated too,
// instead of mixing animation libraries.
export const FollowArtistsContinueButton: React.FC<FollowArtistsContinueButtonProps> = ({
  disabled,
  onPress,
  testID,
  children,
}) => {
  const color = useColor()
  // Resolved to plain strings here (regular JS), since `color()` isn't a worklet and can't be
  // called from inside `useAnimatedStyle`, which runs on the UI thread.
  const disabledColor = color("mono30")
  const enabledColor = color("mono100")
  const pressedColor = color("blue100")

  const colorState = useSharedValue(disabled ? DISABLED : ENABLED)

  useEffect(() => {
    colorState.set(() =>
      withTiming(disabled ? DISABLED : ENABLED, { duration: ANIMATION_DURATION })
    )
  }, [disabled, colorState])

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorState.get(),
      [DISABLED, ENABLED, PRESSED],
      [disabledColor, enabledColor, pressedColor]
    ),
  }))

  const handlePressIn = () => {
    if (disabled) return
    colorState.set(() => withTiming(PRESSED, { duration: ANIMATION_DURATION }))
  }

  const handlePressOut = () => {
    if (disabled) return
    colorState.set(() => withTiming(ENABLED, { duration: ANIMATION_DURATION }))
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
    >
      <Animated.View
        style={[
          {
            height: 50,
            width: "100%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          },
          animatedStyle,
        ]}
      >
        <Text variant="sm-display" color="mono0">
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  )
}
