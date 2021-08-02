import { useColor } from "palette/hooks"
import React, { DependencyList, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import { animated, config, useSpring } from "react-spring"
import styled from "styled-components/native"
import { Color, SansSize, ThemeV3 } from "../../Theme"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { Text } from "../Text"

/** Different theme variations */
export type ButtonVariant = "fillDark" | "fillLight" | "fillGray" | "outline" | "text"

/** Default button color variant */
export const defaultVariant: ButtonVariant = "fillDark"

/** The size of the button */
export type ButtonSize = "small" | "large"

/** Icon position */
export type ButtonIconPosition = "left" | "right"

/** Default button size */
export const defaultSize: ButtonSize = "large"

/** Default icon position */
export const defaultIconPosition: ButtonIconPosition = "left"

export interface ButtonProps extends ButtonBaseProps {
  children: ReactNode
  /** The icon component */
  icon?: ReactNode
  /** Icon position */
  iconPosition?: ButtonIconPosition
  /** The size of the button */
  size?: ButtonSize
  /** The theme of the button */
  variant?: ButtonVariant
  /** React Native only, Callback on press, use instead of onClick */
  onPress?: (event: GestureResponderEvent) => void

  /**
   * `haptic` can be used like:
   * <Button haptic />
   * or
   * <Button haptic="impactHeavy" />
   * to add haptic feedback on the button.
   */
  haptic?: HapticFeedbackTypes | true

  /** Used only for tests and stories */
  _state?: DisplayState
}

export interface ButtonBaseProps extends BoxProps {
  /** Size of the button */
  buttonSize?: ButtonSize
  /** Displays a loader in the button */
  loading?: boolean
  /** Disabled interactions */
  disabled?: boolean
  /** Makes button full width */
  block?: boolean
  /** Pass the longest text to the button for the button to keep longest text width */
  longestText?: string
}

enum DisplayState {
  Enabled = "enabled",
  Pressed = "pressed",
  Loading = "loading",
  Disabled = "disabled",
}

/** A button with various size and color settings */
const PureButton: React.FC<ButtonProps> = ({
  children,
  disabled,
  haptic,
  icon,
  iconPosition = defaultIconPosition,
  loading,
  _state,
  longestText,
  onPress,
  size = defaultSize,
  style,
  variant = defaultVariant,
  ...rest
}) => {
  const color = useColor()

  const [buttonState, setButtonState] = useStateWithEffect(
    _state ?? DisplayState.Enabled,
    (s, [_s, dis, loa]) => {
      if (_s !== undefined) {
        return _s
      }
      if (dis) {
        return DisplayState.Disabled
      }
      if (loa) {
        return DisplayState.Loading
      }
      return s
    },
    [_state, disabled, loading]
  )

  // const [current, setCurrent] = useState(disabled ? DisplayState.Disabled : DisplayState.Enabled)
  // useEffect(() => {

  //   if(disabled) {
  //     return

  // }, [disabled, loading])

  const getSize = (): { height: number; size: SansSize; px: number } => {
    switch (size) {
      case "small":
        return { height: 30, size: "2", px: 15 }
      case "large":
        return { height: 50, size: "3t", px: 30 }
    }
  }

  const to = useStyleForVariantAndState({ variant, state: buttonState })
  const animProps = useSpring({
    to,
    // config: config.stiff,
    // extract this to a helper
    config: { ...config.stiff, duration: 3000 },
  })

  const spinnerColor = variant === "text" ? "blue100" : "white100"

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress === undefined) {
      return
    }

    if (buttonState === DisplayState.Loading || buttonState === DisplayState.Disabled) {
      return
    }

    // Did someone tap really fast? Flick the highlighted state
    // if (buttonState === DisplayState.Enabled) {
    //   setButtonState(DisplayState.Pressed)
    //   setTimeout(() => {
    //     setButtonState(DisplayState.Enabled)
    //   }, 0.3)
    // } else {
    //   // Was already selected
    //   setButtonState(DisplayState.Enabled)
    // }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(event)
  }

  const containerSize = getSize()
  const iconBox = <Box opacity={loading ? 0 : 1}>{icon}</Box>

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onPressIn={() => {
        setButtonState(DisplayState.Pressed)
      }}
      onPressOut={() => {
        setButtonState(DisplayState.Enabled)
      }}
      disabled={disabled}
    >
      <Flex flexDirection="row">
        <AnimatedContainer
          {...rest}
          loading={buttonState === DisplayState.Loading}
          disabled={buttonState === DisplayState.Disabled}
          style={{
            ...animProps,
          }}
          height={containerSize.height}
          px={containerSize.px}
        >
          <VisibleTextContainer>
            {iconPosition === "left" && iconBox}
            <Text
              variant={size === "small" ? "small" : "mediumText"}
              fontSize={size === "small" ? "13" : "16"}
              style={{
                // color: animProps.textColor,
                textDecorationLine: "underline",
                // textDecorationColor: animProps.textDecorationColor,
              }}
            >
              {children}
            </Text>
            {iconPosition === "right" && iconBox}
          </VisibleTextContainer>
          <HiddenContainer>
            {icon}
            <Text fontSize={size === "small" ? "13" : "16"} variant={size === "small" ? "small" : "mediumText"}>
              {longestText ? longestText : children}
            </Text>
          </HiddenContainer>
          {buttonState === DisplayState.Loading ? <Spinner size={size} color={spinnerColor} /> : null}
        </AnimatedContainer>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

const useStyleForVariantAndState = ({
  variant,
  state,
}: {
  variant: ButtonVariant
  state: DisplayState
}): {
  backgroundColor: string
  borderColor: string
  textColor: string
  textDecorationColor: string
} => {
  const color = useColor()

  switch (variant) {
    // case "fillDark":
    case "fillLight":
      switch (state) {
        case DisplayState.Enabled:
          return {
            backgroundColor: color("white100"),
            borderColor: color("white100"),
            textColor: color("black100"),
            textDecorationColor: "transparent",
          }
        case DisplayState.Pressed:
          return {
            backgroundColor: color("blue100"),
            borderColor: color("blue100"),
            textColor: color("white100"),
            textDecorationColor: color("white100"),
          }
        case DisplayState.Loading:
          // loading
          // backgroundColor: variant === "text" ? color("black10") : disabled ? color("black30") : color("blue100"),
          return {
            backgroundColor: color("blue100"),
            borderColor: "transparent",
            textColor: "transparent",
            textDecorationColor: "transparent",
          }
        case DisplayState.Disabled:
          return {
            backgroundColor: color("black30"),
            borderColor: color("black30"),
            textColor: color("white100"),
            textDecorationColor: "transparent",
          }
        default:
          assertNever(state)
      }
      assertNever(state)

    default:
      return {
        backgroundColor: "orange",
        color: "purple",
      }
  }

  const blackWithOpacity = disabled ? color("black30") : color("black100")
  const blackWithFullOpacity = disabled ? color("white100") : color("black100")
  const black10WithOpacity = disabled ? color("black30") : color("black10")
  const whiteWithOpacity = disabled ? color("black30") : color("white100")
  const blueWithOpacity = disabled ? color("black30") : color("blue100")

  switch (variant) {
    case "fillDark":
      return {
        default: {
          backgroundColor: blackWithOpacity,
          borderColor: blackWithOpacity,
          color: color("white100"),
          textColor: color("white100"),
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: whiteWithOpacity,
          textColor: whiteWithOpacity,
        },
      }

    case "fillGray":
      return {
        default: {
          backgroundColor: black10WithOpacity,
          borderColor: black10WithOpacity,
          color: blackWithFullOpacity,
          textColor: blackWithFullOpacity,
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: color("white100"),
          textColor: color("white100"),
        },
      }
    case "outline":
      return {
        default: {
          backgroundColor: color("white100"),
          borderColor: blackWithOpacity,
          color: blackWithOpacity,
          textColor: blackWithOpacity,
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: color("white100"),
          textColor: color("white100"),
        },
      }
    case "text":
      return {
        default: {
          backgroundColor: color("white100"),
          borderColor: color("white100"),
          color: blackWithOpacity,
          textColor: blackWithOpacity,
        },
        hover: {
          backgroundColor: color("black10"),
          borderColor: color("black10"),
          color: blueWithOpacity,
          textColor: blueWithOpacity,
        },
      }
  }
}

export const Button: React.FC<ButtonProps> = (props) => (
  <ThemeV3>
    <PureButton {...props} />
  </ThemeV3>
)

/** Base props that construct button */

const VisibleTextContainer = styled(Box)`
  position: absolute;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`

const HiddenContainer = styled(Box)<ButtonProps>`
  display: flex;
  flex-direction: row;
  opacity: 0;
`

const Container = styled(Box)<ButtonProps>`
  align-items: center;
  justify-content: center;
  position: relative;
  border-width: 1;
  border-radius: 50;
  width: ${(p) => (p.block ? "100%" : "auto")};
`

const AnimatedContainer = animated(Container)

export { DisplayState as _DisplayState }

export const useStateWithEffect = <ValueType, DepList extends any[]>(
  initialValue: ValueType,
  func: (v: ValueType, d: DepList) => ValueType,
  deps: [...DepList]
): [ValueType, Dispatch<SetStateAction<ValueType>>] => {
  const [internalValue, setInternalValue] = useState(initialValue)
  const [combinedValue, setCombinedValue] = useState(initialValue)

  useEffect(() => {
    setCombinedValue(func(internalValue, deps))
  }, [...deps, internalValue])

  return [combinedValue, setInternalValue]
}
