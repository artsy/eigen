import { useColor } from "palette/hooks"
import React, { ReactNode, useState } from "react"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import { ColorFuncOverload, SansSize, ThemeV3 } from "../../Theme"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { Text } from "../Text"

/** Different theme variations */
export type ButtonVariant = "primaryBlack" | "primaryWhite" | "secondaryGray" | "secondaryOutline" | "text"

/** Default button color variant */
export const defaultVariant: ButtonVariant = "primaryBlack"

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
}

export interface ButtonBaseProps extends BoxProps {
  /** Size of the button */
  buttonSize?: ButtonSize
  /** Displays a loader in the button */
  loading?: boolean
  /** Disabled interactions */
  disabled?: boolean
  /** Uses inline style for button */
  inline?: boolean
  /** Makes button full width */
  block?: boolean
  /** Additional styles to apply to the variant */
  variantStyles?: any // FIXME
  /** Pass the longest text to the button for the button to keep longest text width */
  longestText?: string
}

/**
 * Returns various colors for each state given a button variant
 * @param variant
 */
export function getColorsForVariant(variant: ButtonVariant, disabled: boolean = false, color: ColorFuncOverload) {
  const black100WithOpacity = disabled ? color("black30") : color("black100")
  const black10WithOpacity = disabled ? color("black30") : color("black10")
  const white100 = color("white100")
  const whiteWithOpacity = disabled ? color("black30") : color("white100")
  const blue100WithOpacity = disabled ? color("black30") : color("blue100")

  switch (variant) {
    case "primaryBlack":
      return {
        default: {
          backgroundColor: black100WithOpacity,
          borderColor: black100WithOpacity,
          color: white100,
          textColor: white100,
        },
        hover: {
          backgroundColor: blue100WithOpacity,
          borderColor: blue100WithOpacity,
          color: whiteWithOpacity,
          textColor: whiteWithOpacity,
        },
      }
    case "primaryWhite":
      return {
        default: {
          backgroundColor: whiteWithOpacity,
          borderColor: whiteWithOpacity,
          color: disabled ? color("white100") : color("black100"),
          textColor: disabled ? color("white100") : color("black100"),
        },
        hover: {
          backgroundColor: blue100WithOpacity,
          borderColor: blue100WithOpacity,
          color: color("white100"),
          textColor: color("white100"),
        },
      }
    case "secondaryGray":
      return {
        default: {
          backgroundColor: black10WithOpacity,
          borderColor: black10WithOpacity,
          color: disabled ? color("white100") : color("black100"),
          textColor: disabled ? color("white100") : color("black100"),
        },
        hover: {
          backgroundColor: blue100WithOpacity,
          borderColor: blue100WithOpacity,
          color: color("white100"),
          textColor: color("white100"),
        },
      }
    case "secondaryOutline":
      return {
        default: {
          backgroundColor: white100,
          borderColor: black100WithOpacity,
          color: black100WithOpacity,
          textColor: black100WithOpacity,
        },
        hover: {
          backgroundColor: blue100WithOpacity,
          borderColor: blue100WithOpacity,
          color: color("white100"),
          textColor: color("white100"),
        },
      }
    case "text":
      return {
        default: {
          backgroundColor: white100,
          borderColor: white100,
          color: black100WithOpacity,
          textColor: black100WithOpacity,
        },
        hover: {
          backgroundColor: color("black10"),
          borderColor: color("black10"),
          color: blue100WithOpacity,
          textColor: blue100WithOpacity,
        },
      }
  }
}

enum DisplayState {
  Enabled = "default",
  Highlighted = "hover",
  Disabled = "default",
}

/** A button with various size and color settings */
const PureButton: React.FC<ButtonProps> = (props) => {
  const color = useColor()
  const size = props.size ?? defaultSize
  const variant = props.variant ?? defaultVariant
  const iconPosition = props.iconPosition ?? defaultIconPosition

  const [previous, setPrevious] = useState(DisplayState.Enabled)
  const [current, setCurrent] = useState(DisplayState.Enabled)

  const getSize = (): { height: number; size: SansSize; px: number } => {
    switch (size) {
      case "small":
        return { height: props.inline ? 17 : 30, size: "2", px: props.inline ? 0 : 1 }
      case "large":
        return { height: props.inline ? 21 : 50, size: "3t", px: props.inline ? 0 : 3 }
    }
  }

  const loadingStyles = (() => {
    if (!props.loading) {
      return {}
    }

    if (props.inline) {
      return {
        backgroundColor: variant === "text" ? color("black10") : props.disabled ? color("black30") : color("blue100"),
        color: color("white100"),
        borderWidth: 0,
        textColor: "transparent",
      }
    }

    return {
      backgroundColor: variant === "text" ? color("black10") : props.disabled ? color("black30") : color("blue100"),
      borderColor: color("blue100"),
      color: color("white100"),
      borderWidth: 0,
      textColor: "transparent",
    }
  })()

  const spinnerColor = variant === "text" ? "blue100" : "white100"

  const onPress = (event: GestureResponderEvent) => {
    if (props.onPress === undefined) {
      return
    }

    // Did someone tap really fast? Flick the highlighted state
    if (current === DisplayState.Enabled) {
      setPrevious(current)
      setCurrent(DisplayState.Highlighted)
      setTimeout(() => {
        setPrevious(current)
        setCurrent(DisplayState.Enabled)
      }, 0.3)
    } else {
      // Was already selected
      setCurrent(DisplayState.Enabled)
    }

    if (props.haptic !== undefined) {
      Haptic.trigger(props.haptic === true ? "impactLight" : props.haptic)
    }

    props.onPress(event)
  }

  const { children, loading, disabled, inline, longestText, style, icon, ...rest } = props
  const s = getSize()
  const variantColors = getColorsForVariant(variant, disabled, color)

  const from = variantColors[previous]
  const to = variantColors[current]
  const iconBox = <Box opacity={loading ? 0 : 1}>{icon}</Box>

  return (
    <Spring native from={from} to={to}>
      {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        (springProps) => (
          <TouchableWithoutFeedback
            onPress={onPress}
            onPressIn={() => {
              setPrevious(DisplayState.Enabled)
              setCurrent(DisplayState.Highlighted)
            }}
            onPressOut={() => {
              setPrevious(DisplayState.Highlighted)
              setCurrent(DisplayState.Enabled)
            }}
            disabled={disabled}
          >
            <Flex flexDirection="row">
              <AnimatedContainer
                {...rest}
                loading={loading}
                disabled={disabled}
                style={{ ...springProps, ...loadingStyles, height: s.height }}
                px={s.px}
              >
                <VisibleTextContainer>
                  {iconPosition === "left" && iconBox}
                  <Text
                    color={loadingStyles.textColor || to.textColor}
                    variant={size === "small" ? "small" : "mediumText"}
                    fontSize={size === "small" ? "1" : "3"}
                    style={{ textDecorationLine: current === "hover" ? "underline" : "none" }}
                  >
                    {children}
                  </Text>
                  {iconPosition === "right" && iconBox}
                </VisibleTextContainer>
                <HiddenContainer>
                  {icon}
                  <Text
                    color={loadingStyles.textColor || to.textColor}
                    variant={size === "small" ? "small" : "mediumText"}
                    fontSize={size === "small" ? "1" : "3"}
                    style={{ textDecorationLine: current === "hover" ? "underline" : "none" }}
                  >
                    {children}
                  </Text>
                </HiddenContainer>

                {!!loading && <Spinner size={size} color={spinnerColor} />}
              </AnimatedContainer>
            </Flex>
          </TouchableWithoutFeedback>
        )
      }
    </Spring>
  )
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
