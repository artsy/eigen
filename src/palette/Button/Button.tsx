import { Box, BoxProps, Flex, Spacer, Spinner, useTextStyleForPalette } from "@artsy/palette-mobile"
import { Text } from "palette"
import { useColorsForVariantAndState } from "palette/Button/colors"
import { useEffect, useState } from "react"
import { PressableProps, GestureResponderEvent, Pressable } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { MeasuredView, ViewMeasurements } from "shared/utils"

type ButtonSize = "small" | "large"
type ButtonVariant =
  | "fillDark"
  | "fillLight"
  | "fillGray"
  | "fillSuccess"
  | "outline"
  | "outlineGray"
  | "outlineLight"
  | "text"

export interface ButtonProps extends BoxProps {
  children: React.ReactNode

  size?: ButtonSize
  variant?: ButtonVariant
  onPress?: PressableProps["onPress"]

  icon?: React.ReactNode
  iconPosition?: "left" | "left-start" | "right"

  /**
   * `haptic` can be used like:
   * <Button haptic />
   * or
   * <Button haptic="impactHeavy" />
   * to add haptic feedback on the button.
   */
  haptic?: HapticFeedbackTypes | true

  /** Displays a loader in the button */
  loading?: boolean

  /** Disabled interactions */
  disabled?: boolean

  /** Makes button full width */
  block?: boolean

  /** Pass the longest text to the button for the button to keep longest text width */
  longestText?: string

  /** Used only for tests and stories */
  testOnly_pressed?: PressableProps["testOnly_pressed"]
}

export const Button = ({
  children,
  disabled: disabledProp,
  haptic,
  icon,
  iconPosition = "left",
  loading: loadingProp,
  block,
  longestText,
  onPress,
  size = "large",
  variant = "fillDark",
  testOnly_pressed,
  testID,
  ...restProps
}: ButtonProps) => {
  // these are basically booleans
  const disabled = useSharedValue<0 | 1>(!!disabledProp ? 1 : 0)
  const loading = useSharedValue<0 | 1>(!!loadingProp ? 1 : 0)
  const pressed = useSharedValue<0 | 1>(!!testOnly_pressed ? 1 : 0)

  useEffect(() => {
    disabled.value = disabledProp ? 1 : 0
    loading.value = loadingProp ? 1 : 0
    pressed.value = testOnly_pressed ? 1 : 0
  }, [disabledProp, loadingProp, testOnly_pressed])

  const textStyle = useTextStyleForPalette(size === "small" ? "xs" : "sm")
  const [longestTextMeasurements, setLongestTextMeasurements] = useState<ViewMeasurements>({
    width: 0,
    height: 0,
  })

  const height = (() => {
    switch (size) {
      case "small":
        return 30
      case "large":
        return 50
    }
  })()

  const spinnerColor = variant === "text" ? "blue100" : "white100"

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress === undefined || onPress === null) {
      return
    }

    if (disabled.value === 1 || loading.value === 1) {
      return
    }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(event)
  }

  const bgColor = useSharedValue("black")
  const borderColor = useSharedValue("black")
  const containerColorsAnim = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
    borderColor: borderColor.value,
  }))

  const textColor = useSharedValue("black")
  const underline = useSharedValue<0 | 1>(0)
  const textAnim = useAnimatedStyle(() => ({
    color: textColor.value,
    textDecorationLine: underline.value === 1 ? "underline" : "none",
  }))

  const colorsForVariantAndState = useColorsForVariantAndState()

  useAnimatedReaction(
    () => [disabled.value, loading.value, pressed.value],
    ([disabledVal, loadingVal, pressedVal]) => {
      const toColor = (c: string) => withTiming(c, { duration: 150 })

      const states = colorsForVariantAndState[variant]
      const colors =
        disabledVal === 1 ? states.disabled : pressedVal === 1 ? states.pressed : states.active
      const { bg, border, text } = colors

      bgColor.value = toColor(bg)
      borderColor.value = toColor(border)
      textColor.value = loadingVal === 1 ? "rgba(0, 0, 0, 0)" : text
      underline.value = pressedVal
    },
    [variant]
  )

  return (
    <Pressable
      disabled={disabled.value === 1}
      onPressIn={() => {
        if (loading.value === 1) {
          return
        }
        pressed.value = 1
      }}
      onPressOut={() => {
        if (loading.value === 1) {
          return
        }
        pressed.value = 0
      }}
      onPress={handlePress}
      testID={testID}
      testOnly_pressed={testOnly_pressed}
    >
      <Flex
        {...restProps}
        height={height}
        width={block ? "100%" : undefined}
        borderRadius={50}
        overflow="hidden"
      >
        <Animated.View
          style={[{ borderWidth: 1, borderRadius: 50, overflow: "hidden" }, containerColorsAnim]}
        >
          <Flex
            height="100%"
            mx="25px"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            {iconPosition === "left-start" && !!icon ? (
              <Box position="absolute" left={0}>
                {icon}
                <Spacer x={0.5} />
              </Box>
            ) : null}

            {iconPosition === "left" && !!icon ? (
              <>
                {icon}
                <Spacer x={0.5} />
              </>
            ) : null}

            <AText
              style={[{ width: Math.ceil(longestTextMeasurements.width) }, textStyle, textAnim]}
              textAlign="center"
            >
              {children}
            </AText>

            {/* This makes sure that in testing environment the button text is
                not rendered twice, in normal environment this is not visible.
                This will result in us being able to use getByText over
                getAllByText()[0] to select the buttons in the test environment. */}
            {!__TEST__ && (
              <MeasuredView setMeasuredState={setLongestTextMeasurements}>
                <Text color="red" style={textStyle}>
                  {longestText ? longestText : children}
                </Text>
              </MeasuredView>
            )}

            {iconPosition === "right" && !!icon ? (
              <>
                <Spacer x={0.5} />
                {icon}
              </>
            ) : null}
          </Flex>

          {loading.value === 1 ? (
            <Box
              position="absolute"
              width="100%"
              height="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size={size} color={spinnerColor} />
            </Box>
          ) : null}
        </Animated.View>
      </Flex>
    </Pressable>
  )
}

const AText = Animated.createAnimatedComponent(Text)
