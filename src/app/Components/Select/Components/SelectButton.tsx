import {
  Flex,
  HORIZONTAL_PADDING,
  INPUT_BORDER_RADIUS,
  INPUT_HEIGHT,
  INPUT_MIN_HEIGHT,
  INPUT_VARIANTS,
  InputState,
  InputTitle,
  InputVariant,
  Text,
  Touchable,
  TriangleDown,
  getInputState,
  getInputVariant,
  useColor,
  useTextStyleForPalette,
} from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import { TouchableOpacity } from "react-native"
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
  showTitleLabel?: boolean
  subTitle?: string
  testID?: string
  title?: string
  tooltipText?: string | JSX.Element
  value?: React.ReactNode
}> = ({
  disabled,
  hasError,
  modalVisible,
  onPress,
  onTooltipPress,
  optional,
  placeholder,
  required,
  showTitleLabel,
  subTitle,
  testID,
  title,
  tooltipText,
  value,
}) => {
  const color = useColor()
  const textStyle = useTextStyleForPalette("sm")

  const variant: InputVariant = getInputVariant({
    hasError: !!hasError,
    editable: !disabled,
  })

  const animatedState = useSharedValue<InputState>(
    getInputState({ isFocused: modalVisible, value: value?.toString() })
  )

  animatedState.value = getInputState({ isFocused: modalVisible, value: value?.toString() })

  const hasSelectedValue = !!value

  const animatedStyles = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(INPUT_VARIANTS[variant][animatedState.value].inputBorderColor),
    }
  })

  const labelStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: "white",
      paddingHorizontal: withTiming(hasSelectedValue ? 5 : 0),
      color: withTiming(INPUT_VARIANTS[variant][animatedState.value].labelColor),
      top: withTiming(
        hasSelectedValue
          ? -((INPUT_HEIGHT + parseInt(THEME.textVariants["sm-display"].fontSize, 10) / 2) / 2)
          : 0
      ),
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
        <Touchable onPress={onTooltipPress} haptic="impactLight">
          <Text underline variant="xs" color="black60" textAlign="right" mb={0.5}>
            {tooltipText}
          </Text>
        </Touchable>
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
          <AnimatedText style={labelStyles}>{title}</AnimatedText>
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
            <TriangleDown fill="black60" height={16} width={16} />
          </Flex>
        </AnimatedFlex>
      </Touchable>
    </>
  )

  return (
    <Flex>
      <Flex flexDirection="row">
        <Flex flex={1}>
          {!!showTitleLabel && (
            <InputTitle optional={optional} required={required}>
              {title}
            </InputTitle>
          )}

          {!!subTitle && (
            <Text variant="xs" color="black60" mb={0.5}>
              {subTitle}
            </Text>
          )}
        </Flex>
        {!!tooltipText && (
          <Flex justifyContent="flex-end" ml="auto">
            <Text variant="xs" color="black60" mb={0.5} onPress={onTooltipPress}>
              {tooltipText}
            </Text>
          </Flex>
        )}
      </Flex>
      <TouchableOpacity accessible accessibilityRole="button" onPress={onPress} testID={testID}>
        <Flex
          px={1}
          flexDirection="row"
          height={INPUT_HEIGHT}
          borderWidth={1}
          borderColor={hasError ? color("red100") : color("black30")}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text style={textStyle} color={value ? "black100" : "black60"} mr={0.5}>
            {value ?? placeholder ?? "Pick an option"}
          </Text>
          <TriangleDown />
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}

const AnimatedFlex = Animated.createAnimatedComponent(Flex)
const AnimatedText = Animated.createAnimatedComponent(Text)
