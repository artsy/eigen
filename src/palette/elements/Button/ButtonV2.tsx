import { useColor } from "palette/hooks"
import React, { ReactNode, useState } from "react"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import { SansSize, themeProps, ThemeV2 } from "../../Theme"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { Sans } from "../Text"

/** Different theme variations */
export type ButtonVariant =
  | "primaryBlack"
  | "primaryWhite"
  | "secondaryGray"
  | "secondaryOutline"
  | "secondaryOutlineWarning"
  | "noOutline"

/** Default button color variant */
export const defaultVariant: ButtonVariant = "primaryBlack"

/** The size of the button */
type ButtonSize = "small" | "medium" | "large"

/** Icon position */
type ButtonIconPosition = "left" | "right"

/** Default button size */
const defaultSize: ButtonSize = "medium"

/** Default icon position */
const defaultIconPosition: ButtonIconPosition = "left"

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
export function getColorsForVariant(variant: ButtonVariant, disabled: boolean = false) {
  const {
    colors: { black100, white100, red100 },
  } = themeProps

  const opacity = disabled ? "0.1" : "1"
  const black100WithOpacity = `rgba(0, 0, 0, ${opacity})`
  const black10WithOpacity = `rgba(229, 229, 229, ${opacity})`
  const whiteWithOpacity = `rgba(255, 255, 255, ${opacity})`
  const purple100WithOpacity = `rgba(110, 30, 255, ${opacity})`
  const black30WithOpacity = `rgba(194, 194, 194, ${opacity})`
  const red100WithOpacity = `rgba(232, 46, 29, ${opacity})`

  switch (variant) {
    case "primaryBlack":
      return {
        default: {
          backgroundColor: black100WithOpacity,
          borderColor: black100WithOpacity,
          color: whiteWithOpacity,
          textColor: white100,
        },
        hover: {
          backgroundColor: purple100WithOpacity,
          borderColor: purple100WithOpacity,
          color: whiteWithOpacity,
          textColor: white100,
        },
      }
    case "primaryWhite":
      return {
        default: {
          backgroundColor: whiteWithOpacity,
          borderColor: whiteWithOpacity,
          color: black100WithOpacity,
          textColor: black100,
        },
        hover: {
          backgroundColor: purple100WithOpacity,
          borderColor: purple100WithOpacity,
          color: whiteWithOpacity,
          textColor: white100,
        },
      }
    case "secondaryGray":
      return {
        default: {
          backgroundColor: black10WithOpacity,
          borderColor: black10WithOpacity,
          color: black100WithOpacity,
          textColor: black100,
        },
        hover: {
          backgroundColor: black30WithOpacity,
          borderColor: black30WithOpacity,
          color: black100WithOpacity,
          textColor: black100,
        },
      }
    case "secondaryOutline":
      return {
        default: {
          backgroundColor: whiteWithOpacity,
          borderColor: black10WithOpacity,
          color: black100WithOpacity,
          textColor: black100,
        },
        hover: {
          backgroundColor: whiteWithOpacity,
          borderColor: black100WithOpacity,
          color: black100WithOpacity,
          textColor: black100,
        },
      }
    case "secondaryOutlineWarning":
      return {
        default: {
          backgroundColor: whiteWithOpacity,
          borderColor: black10WithOpacity,
          color: red100WithOpacity,
          textColor: red100,
        },
        hover: {
          backgroundColor: whiteWithOpacity,
          borderColor: black100WithOpacity,
          color: black100WithOpacity,
          textColor: black100,
        },
      }
    case "noOutline":
      return {
        default: {
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
          color: black100WithOpacity,
          textColor: black100,
        },
        hover: {
          backgroundColor: whiteWithOpacity,
          borderColor: black100WithOpacity,
          color: black100WithOpacity,
          textColor: black100,
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
        return { height: props.inline ? 17 : 26, size: "2", px: props.inline ? 0 : 1 }
      case "medium":
        return { height: props.inline ? 21 : 41, size: "3t", px: props.inline ? 0 : 2 }
      case "large":
        return { height: props.inline ? 21 : 50, size: "3t", px: props.inline ? 0 : 3 }
    }
  }

  const loadingStyles = (() => {
    const opacity = props.disabled ? "0.1" : "1"

    if (!props.loading) {
      return {}
    }

    if (props.inline) {
      return {
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        color: color("white100"),
        borderWidth: 0,
        textColor: "transparent",
      }
    }

    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      borderColor: `rgba(0, 0, 0, 0)`,
      color: color("white100"),
      textColor: "transparent",
    }
  })()

  const spinnerColor = (() => {
    if (props.inline) {
      return variant === "primaryWhite" ? "white100" : "black100"
    }

    return "white100"
  })()

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
  const variantColors = getColorsForVariant(variant, disabled)

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
                  <Sans weight="medium" color={loadingStyles.textColor || to.textColor} size={s.size}>
                    {children}
                  </Sans>
                  {iconPosition === "right" && iconBox}
                </VisibleTextContainer>
                <HiddenContainer>
                  {icon}
                  <LongestText role="presentation" weight="medium" size={s.size}>
                    {longestText ? longestText : children}
                  </LongestText>
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

export const ButtonV2: React.FC<ButtonProps> = (props) => (
  <ThemeV2>
    <PureButton {...props} />
  </ThemeV2>
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

const LongestText = styled(Sans)``

const Container = styled(Box)<ButtonProps>`
  align-items: center;
  justify-content: center;
  position: relative;
  border-width: 1;
  border-radius: 3;
  width: ${(p) => (p.block ? "100%" : "auto")};
`

const AnimatedContainer = animated(Container)
