import {
  Flex,
  HORIZONTAL_PADDING,
  INPUT_BORDER_RADIUS,
  INPUT_MIN_HEIGHT,
  InputState,
  InputVariant,
  Text,
  Touchable,
  TriangleDown,
  getInputState,
  getInputVariant,
  getInputVariants,
  useColor,
  useSpace,
  useTheme,
} from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

export const SelectButton: React.FC<{
  disabled?: boolean
  hasError?: boolean
  modalVisible: boolean
  onPress(): void
  onTooltipPress?(): void
  optional?: boolean
  placeholder?: string
  required?: boolean
  subTitle?: string
  testID?: string
  title?: string
  tooltipText?: string | JSX.Element
  value?: React.ReactNode
  error?: string
}> = ({
  disabled,
  hasError,
  modalVisible,
  onPress,
  onTooltipPress,
  optional,
  placeholder,
  required,
  testID,
  title,
  tooltipText,
  value,
  error,
}) => {
  const space = useSpace()
  const color = useColor()

  const variant: InputVariant = getInputVariant({
    hasError: !!hasError || !!error,
    disabled: !!disabled,
  })

  const animatedState = useSharedValue<InputState>(
    getInputState({ isFocused: modalVisible, value: value?.toString() })
  )

  animatedState.value = getInputState({ isFocused: modalVisible, value: value?.toString() })

  const hasSelectedValue = !!value

  const { theme } = useTheme()
  const inputVariants = getInputVariants(theme)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(inputVariants[variant][animatedState.value].inputBorderColor),
    }
  })

  const labelStyles = useAnimatedStyle(() => {
    return {
      paddingHorizontal: withTiming(hasSelectedValue ? 5 : 0),
      color: withTiming(inputVariants[variant][animatedState.value].labelColor),
      top: withTiming(hasSelectedValue ? -INPUT_MIN_HEIGHT / 2 : 0),
      fontSize: withTiming(
        hasSelectedValue
          ? parseInt(THEME.textVariants["xs"].fontSize, 10)
          : parseInt(THEME.textVariants["sm-display"].fontSize, 10)
      ),
    }
  })

  return (
    <>
      {!!tooltipText && !!onTooltipPress && (
        <Flex
          style={{
            alignItems: "flex-end",
            marginBottom: space(0.5),
          }}
        >
          <Touchable
            accessibilityRole="button"
            onPress={onTooltipPress}
            haptic="impactLight"
            hitSlop={{ top: 10, bottom: 10 }}
          >
            <Text underline variant="xs" color="mono60">
              {tooltipText}
            </Text>
          </Touchable>
        </Flex>
      )}
      <Touchable accessible accessibilityRole="button" onPress={onPress} testID={testID}>
        <AnimatedFlex
          style={[
            {
              borderRadius: INPUT_BORDER_RADIUS,
              borderWidth: 1,
              height: INPUT_MIN_HEIGHT,
              paddingHorizontal: HORIZONTAL_PADDING,
              alignItems: "center",
            },
            animatedStyles,
          ]}
          flexDirection="row"
        >
          {!!title && (
            <AnimatedText style={[{ backgroundColor: color("background") }, labelStyles]}>
              {title}
            </AnimatedText>
          )}

          {!!value && (
            <Text
              variant="sm-display"
              style={{
                position: "absolute",
                left: HORIZONTAL_PADDING,
                // The arrow down icon is 18px wide, so we need to add 18px to the padding
                // to make sure the text doesn't get shown below the arrow
                paddingRight: HORIZONTAL_PADDING / 2 + 18,
                width: "100%",
              }}
              numberOfLines={1}
            >
              {value ?? placeholder ?? "Pick an option"}
            </Text>
          )}
          <Flex
            style={{
              position: "absolute",
              right: HORIZONTAL_PADDING,
            }}
          >
            <TriangleDown fill="mono60" height={16} width={16} />
          </Flex>
        </AnimatedFlex>
      </Touchable>
      {/* No need to show required if we have an error message */}
      {(!!required || !!optional) && !error ? (
        <Text color="mono60" variant="xs" pl={`${HORIZONTAL_PADDING}px`} mt={0.5}>
          {!!required && "* Required"}
          {!!optional && "* Optional"}
        </Text>
      ) : null}
      {!!error && (
        <Text
          color="red100"
          pl={`${HORIZONTAL_PADDING}px`}
          mt={0.5}
          variant="xs"
          testID="input-error"
        >
          {error}
        </Text>
      )}
    </>
  )
}

const AnimatedFlex = Animated.createAnimatedComponent(Flex)
const AnimatedText = Animated.createAnimatedComponent(Text)
