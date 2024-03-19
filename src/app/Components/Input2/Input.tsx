import { Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import themeGet from "@styled-system/theme-get"
import { useState } from "react"
import { TextInput, TextInputProps } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import styled from "styled-components"

interface InputProps extends TextInputProps {
  value: string
  onChangeText: (text: string) => void
  required?: boolean
  onHintPress?: () => void
  hintText?: string
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  hintText = "What's this?",
  editable = true,
  ...props
}) => {
  const [focused, setIsFocused] = useState(false)
  const variant: InputVariant = getInputVariant({
    hasError: !!props.error,
    editable: editable,
  })

  const animatedState = useSharedValue<InputState>(getInputState({ isFocused: !!focused, value }))
  const space = useSpace()

  const handleChangeText = (text: string) => {
    "worklet"
    onChangeText(text)
  }

  const styles = {
    fontFamily: THEME.fonts.sans,
    // TODO: This should be THEME.textVariants["sm-display"].fontSize
    // But this doesn't match the design which shows 16px
    fontSize: 16,
    lineHeight: 20,
    minHeight: 56,
    borderWidth: 1,
  }

  const labelStyles = {
    // this is neeeded too make sure the label is on top of the input
    backgroundColor: "white",
    marginLeft: 15,
    marginRight: space(0.5),
    paddingHorizontal: space(0.5),
    zIndex: 100,
    fontFamily: THEME.fonts.sans,
  }

  animatedState.value = getInputState({ isFocused: !!focused, value })

  const textInputAnimatedStyles = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(VARIANTS[variant][animatedState.value].inputBorderColor),
      color: withTiming(VARIANTS[variant][animatedState.value].inputTextColor),
    }
  })

  const labelAnimatedStyles = useAnimatedStyle(() => {
    return {
      color: withTiming(VARIANTS[variant][animatedState.value].labelColor),
      top: withTiming(VARIANTS[variant][animatedState.value].labelTop),
      fontSize: withTiming(VARIANTS[variant][animatedState.value].labelFontSize),
    }
  })

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <>
      {!!props.onHintPress && (
        <Touchable onPress={props.onHintPress} haptic="impactLight">
          <Text underline variant="xs" color="black60" textAlign="right" mb={0.5}>
            {hintText}
          </Text>
        </Touchable>
      )}

      {!!props.label && (
        <Flex flexDirection="row" zIndex={100} pointerEvents="none">
          <AnimatedText style={[labelStyles, labelAnimatedStyles]} numberOfLines={1}>
            {props.label}
          </AnimatedText>
        </Flex>
      )}

      <AnimatedStyledInput
        value={value}
        onChangeText={handleChangeText}
        style={[styles, textInputAnimatedStyles]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={editable}
        {...props}
      />

      {/* If an input has an error, we don't need to show "Required" because it's already pointed out */}
      {!!props.required && !props.error && (
        <Text color="black60" variant="xs" paddingX="15px" mt={0.5}>
          * Required
        </Text>
      )}

      {!!props.error && (
        <Text color="red100" variant="xs" paddingX="15px" mt={0.5}>
          {props.error}
        </Text>
      )}
    </>
  )
}

const StyledInput = styled(TextInput)`
  padding: 15px;
  font-family: ${themeGet("fonts.sans.regular")};
  border-radius: 4px;
`

const AnimatedStyledInput = Animated.createAnimatedComponent(StyledInput)
const AnimatedText = Animated.createAnimatedComponent(Text)

const SHRINKED_LABEL_TOP = 13
const EXPANDED_LABEL_TOP = 40

type VariantState = {
  untouched: {
    inputBorderColor: string
    labelFontSize: number
    labelColor: string
    labelTop: number
    inputTextColor: string
  }
  touched: {
    inputBorderColor: string
    labelFontSize: number
    labelColor: string
    labelTop: number
    inputTextColor: string
  }
  focused: {
    inputBorderColor: string
    labelFontSize: number
    labelColor: string
    labelTop: number
    inputTextColor: string
  }
}

const DEFAULT_VARIANT_STATES: VariantState = {
  // Unfocused input with no value
  untouched: {
    inputBorderColor: THEME.colors.black30,
    labelFontSize: parseInt(THEME.textVariants["sm-display"].fontSize, 10),
    labelColor: THEME.colors.black60,
    labelTop: EXPANDED_LABEL_TOP,
    inputTextColor: THEME.colors.black100,
  },
  // Unfocused input with value
  touched: {
    inputBorderColor: THEME.colors.black60,
    labelFontSize: parseInt(THEME.textVariants["xs"].fontSize, 10),
    labelColor: THEME.colors.black60,
    labelTop: SHRINKED_LABEL_TOP,
    inputTextColor: THEME.colors.black100,
  },
  // Focused input with or without value
  focused: {
    inputBorderColor: THEME.colors.blue100,
    labelFontSize: parseInt(THEME.textVariants["xs"].fontSize, 10),
    labelColor: THEME.colors.blue100,
    labelTop: SHRINKED_LABEL_TOP,
    inputTextColor: THEME.colors.black100,
  },
}

const ERROR_VARIANT_STATES: VariantState = {
  // Unfocused error input with no value
  untouched: {
    inputBorderColor: THEME.colors.red100,
    labelFontSize: parseInt(THEME.textVariants["sm-display"].fontSize, 10),
    labelColor: THEME.colors.red100,
    labelTop: EXPANDED_LABEL_TOP,
    inputTextColor: THEME.colors.black100,
  },
  // Unfocused error input with value
  touched: {
    inputBorderColor: THEME.colors.red100,
    labelFontSize: parseInt(THEME.textVariants["xs"].fontSize, 10),
    labelColor: THEME.colors.red100,
    labelTop: SHRINKED_LABEL_TOP,
    inputTextColor: THEME.colors.black100,
  },
  // Focused error input with or without value
  focused: {
    inputBorderColor: THEME.colors.red100,
    labelFontSize: parseInt(THEME.textVariants["xs"].fontSize, 10),
    labelColor: THEME.colors.red100,
    labelTop: SHRINKED_LABEL_TOP,
    inputTextColor: THEME.colors.black100,
  },
}

const DISABLED_VARIANT_STATES: VariantState = {
  // Unfocused disabled input with no value
  untouched: {
    inputBorderColor: THEME.colors.black30,
    labelFontSize: parseInt(THEME.textVariants["sm-display"].fontSize, 10),
    labelColor: THEME.colors.black30,
    labelTop: EXPANDED_LABEL_TOP,
    inputTextColor: THEME.colors.black30,
  },
  // Unfocused disabled input with value
  touched: {
    inputBorderColor: THEME.colors.black30,
    labelFontSize: parseInt(THEME.textVariants["xs"].fontSize, 10),
    labelColor: THEME.colors.black30,
    labelTop: SHRINKED_LABEL_TOP,
    inputTextColor: THEME.colors.black30,
  },
  // Focused disabled input with or without value
  // Adding this just to satisfy typescript because a disabled input can't be focused
  focused: {
    inputBorderColor: THEME.colors.black30,
    labelFontSize: parseInt(THEME.textVariants["xs"].fontSize, 10),
    labelColor: THEME.colors.black30,
    labelTop: SHRINKED_LABEL_TOP,
    inputTextColor: THEME.colors.black30,
  },
}

const VARIANTS = {
  default: DEFAULT_VARIANT_STATES,
  error: ERROR_VARIANT_STATES,
  disabled: DISABLED_VARIANT_STATES,
}

type InputState = keyof typeof DEFAULT_VARIANT_STATES
type InputVariant = keyof typeof VARIANTS

const getInputState = ({
  isFocused,
  value,
}: {
  isFocused: boolean
  value: string | undefined
}): InputState => {
  if (isFocused) {
    return "focused"
  } else if (value) {
    return "touched"
  } else {
    return "untouched"
  }
}

const getInputVariant = ({ editable, hasError }: { editable: boolean; hasError: boolean }) => {
  if (hasError) {
    return "error"
  }
  if (!editable) {
    return "disabled"
  }
  return "default"
}
