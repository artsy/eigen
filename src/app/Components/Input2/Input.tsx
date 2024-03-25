import { EventEmitter } from "events"
import {
  Flex,
  Spinner,
  Text,
  Touchable,
  XCircleIcon,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import themeGet from "@styled-system/theme-get"
import { useMeasure } from "app/utils/hooks/useMeasure"
import {
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { LayoutAnimation, TextInput, TextInputProps } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import styled from "styled-components"

export const inputEvents = new EventEmitter()

export const emitInputClearEvent = () => {
  inputEvents.emit("clear")
}

interface InputProps extends TextInputProps {
  addClearListener?: boolean
  enableClearButton?: boolean
  error?: string
  fixedRightPlaceholder?: string
  hintText?: string
  label?: string
  loading?: boolean
  onChangeText: (text: string) => void
  onClear?(): void
  onHintPress?: () => void
  required?: boolean
  unit?: string | undefined | null
  value: string
}

export const HORIZONTAL_PADDING = 15
export const INPUT_BORDER_RADIUS = 4
export const INPUT_MIN_HEIGHT = 56
export const MULTILINE_INPUT_MIN_HEIGHT = 110
export const LABEL_HEIGHT = 25

export interface InputRef {
  focus: () => void
  blur: () => void
  clear: () => void
}

export const Input = forwardRef<InputRef, InputProps>(
  (
    {
      addClearListener = false,
      editable = true,
      enableClearButton = false,
      fixedRightPlaceholder,
      hintText = "What's this?",
      loading = false,
      onChangeText,
      onClear,
      unit,
      value,
      ...props
    },
    ref
  ) => {
    const space = useSpace()
    const color = useColor()

    const [focused, setIsFocused] = useState(false)

    const unitRef = useRef(null)
    const rightComponentRef = useRef(null)
    const inputRef = useRef<TextInput>()

    const variant: InputVariant = getInputVariant({
      hasError: !!props.error,
      editable: editable,
    })

    const hasUnit = !!unit

    const animatedState = useSharedValue<InputState>(getInputState({ isFocused: !!focused, value }))

    useImperativeHandle(ref, () => inputRef.current as InputRef)

    const fontFamily = THEME.fonts.sans

    useEffect(() => {
      /* to make the font work for secure text inputs,
      see https://github.com/facebook/react-native/issues/30123#issuecomment-711076098 */
      inputRef.current?.setNativeProps({
        style: { fontFamily },
      })
    }, [fontFamily])

    useEffect(() => {
      if (!addClearListener) {
        return
      }

      inputEvents.addListener("clear", handleClear)

      return () => {
        inputEvents.removeListener("clear", handleClear)
      }
    }, [])

    const { width: unitWidth = 0 } = useMeasure({ ref: unitRef })
    const { width: rightComponentWidth = 0 } = useMeasure({ ref: rightComponentRef })

    const handleChangeText = (text: string) => {
      "worklet"
      onChangeText(text)
    }

    const styles = {
      fontFamily: THEME.fonts.sans,
      fontSize: parseInt(THEME.textVariants["sm-display"].fontSize, 10),
      minHeight: props.multiline ? MULTILINE_INPUT_MIN_HEIGHT : INPUT_MIN_HEIGHT,
      borderWidth: 1,
      paddingRight: rightComponentWidth + HORIZONTAL_PADDING,
    }

    const labelStyles = {
      // this is neeeded too make sure the label is on top of the input
      backgroundColor: "white",
      marginRight: space(0.5),
      paddingHorizontal: space(0.5),
      zIndex: 100,
      fontFamily: THEME.fonts.sans,
    }

    animatedState.value = getInputState({ isFocused: !!focused, value })

    const textInputAnimatedStyles = useAnimatedStyle(() => {
      return {
        borderColor: withTiming(INPUT_VARIANTS[variant][animatedState.value].inputBorderColor),
        color: withTiming(INPUT_VARIANTS[variant][animatedState.value].inputTextColor),
        paddingLeft: withTiming(hasUnit ? unitWidth + HORIZONTAL_PADDING + 5 : HORIZONTAL_PADDING),
      }
    })

    const labelAnimatedStyles = useAnimatedStyle(() => {
      return {
        color: withTiming(INPUT_VARIANTS[variant][animatedState.value].labelColor),
        top: withTiming(INPUT_VARIANTS[variant][animatedState.value].labelTop),
        fontSize: withTiming(INPUT_VARIANTS[variant][animatedState.value].labelFontSize),
        marginLeft: withTiming(
          hasUnit && !focused && !value ? unitWidth + HORIZONTAL_PADDING : HORIZONTAL_PADDING
        ),
      }
    })

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    const handleClear = () => {
      LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 200 })
      inputRef.current?.clear()
      handleChangeText("")
      onClear?.()
    }

    const renderLeftComponent = useCallback(() => {
      if (unit) {
        return (
          <Flex
            flexDirection="row"
            position="absolute"
            left={`${HORIZONTAL_PADDING}px`}
            top={43}
            ref={unitRef}
            zIndex={40}
            justifyContent="center"
            alignItems="center"
          >
            <Text color={editable ? "black60" : "black30"} variant="sm-display">
              {unit}
            </Text>
          </Flex>
        )
      }

      return null
    }, [unit])

    const renderRightComponent = useCallback(() => {
      if (fixedRightPlaceholder) {
        return (
          <Flex
            justifyContent="center"
            position="absolute"
            right={`${HORIZONTAL_PADDING}px`}
            top={LABEL_HEIGHT}
            height={INPUT_MIN_HEIGHT}
            ref={rightComponentRef}
          >
            <Text color={editable ? "black60" : "black30"}>{fixedRightPlaceholder}</Text>
          </Flex>
        )
      }

      if (loading) {
        return (
          <Flex
            justifyContent="center"
            position="absolute"
            right={`${HORIZONTAL_PADDING}px`}
            top={LABEL_HEIGHT}
            height={INPUT_MIN_HEIGHT}
            ref={rightComponentRef}
          >
            <Spinner
              size="medium"
              style={{
                right: 0,
                width: 15,
                backgroundColor: color("black60"),
              }}
            />
          </Flex>
        )
      }

      if (enableClearButton && value) {
        return (
          <Flex
            justifyContent="center"
            position="absolute"
            right={`${HORIZONTAL_PADDING}px`}
            top={LABEL_HEIGHT}
            height={INPUT_MIN_HEIGHT}
            zIndex={100}
            ref={rightComponentRef}
          >
            <Touchable
              haptic="impactMedium"
              onPress={handleClear}
              hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
              accessibilityLabel="Clear input button"
            >
              <XCircleIcon fill="black30" />
            </Touchable>
          </Flex>
        )
      }
      return null
    }, [fixedRightPlaceholder, loading, enableClearButton, value])

    return (
      <Flex>
        {!!props.onHintPress && (
          <Touchable onPress={props.onHintPress} haptic="impactLight">
            <Text underline variant="xs" color="black60" textAlign="right" mb={0.5}>
              {hintText}
            </Text>
          </Touchable>
        )}

        {!!props.label && (
          <Flex flexDirection="row" zIndex={100} pointerEvents="none" height={LABEL_HEIGHT}>
            <AnimatedText style={[labelStyles, labelAnimatedStyles]} numberOfLines={1}>
              {props.label}
            </AnimatedText>
          </Flex>
        )}

        {renderLeftComponent()}

        {renderRightComponent()}

        <AnimatedStyledInput
          value={value}
          onChangeText={handleChangeText}
          style={[styles, textInputAnimatedStyles]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          ref={inputRef as RefObject<TextInput>}
          {...props}
        />

        {/* If an input has an error, we don't need to show "Required" because it's already pointed out */}
        {!!props.required && !props.error && (
          <Text color="black60" variant="xs" px={`${HORIZONTAL_PADDING}px`} mt={0.5}>
            * Required
          </Text>
        )}

        {!!props.error && (
          <Text color="red100" variant="xs" px={`${HORIZONTAL_PADDING}px`} mt={0.5}>
            {props.error}
          </Text>
        )}
      </Flex>
    )
  }
)

const StyledInput = styled(TextInput)`
  padding: ${HORIZONTAL_PADDING}px;
  font-family: ${themeGet("fonts.sans.regular")};
  border-radius: ${INPUT_BORDER_RADIUS}px;
`

const AnimatedStyledInput = Animated.createAnimatedComponent(StyledInput)
const AnimatedText = Animated.createAnimatedComponent(Text)

const SHRINKED_LABEL_TOP = 13
const EXPANDED_LABEL_TOP = 41

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

export const INPUT_VARIANTS = {
  default: DEFAULT_VARIANT_STATES,
  error: ERROR_VARIANT_STATES,
  disabled: DISABLED_VARIANT_STATES,
}

export type InputState = keyof typeof DEFAULT_VARIANT_STATES
export type InputVariant = keyof typeof INPUT_VARIANTS

export const getInputState = ({
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

export const getInputVariant = ({
  editable,
  hasError,
}: {
  editable: boolean
  hasError: boolean
}) => {
  if (hasError) {
    return "error"
  }
  if (!editable) {
    return "disabled"
  }
  return "default"
}
