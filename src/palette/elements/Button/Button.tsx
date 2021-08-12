import { Text } from "palette"
import { useColor } from "palette/hooks"
import React, { ReactNode, useState } from "react"
import {
  GestureResponderEvent,
  TextStyle,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  ViewStyle,
} from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import { config } from "react-spring"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import { ThemeV3 } from "../../Theme"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"

export type ButtonVariant = "fillDark" | "fillLight" | "fillGray" | "outline" | "text"

const defaultVariant: ButtonVariant = "fillDark"

type ButtonSize = "small" | "large"

type ButtonIconPosition = "left" | "right"

const defaultSize: ButtonSize = "large"

const defaultIconPosition: ButtonIconPosition = "left"

export interface ButtonProps extends ButtonBaseProps {
  children: ReactNode
  icon?: ReactNode
  iconPosition?: ButtonIconPosition
  size?: ButtonSize
  variant?: ButtonVariant
  onPress?: TouchableWithoutFeedbackProps["onPress"]

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
  /** Makes button full width */
  block?: boolean
  /** Pass the longest text to the button for the button to keep longest text width */
  longestText?: string
}

enum DisplayState {
  Enabled = "default",
  Highlighted = "hover",
  Disabled = "default",
}

/** A button with various size and color settings */
const PureButton: React.FC<ButtonProps> = ({
  children,
  disabled,
  haptic,
  icon,
  iconPosition = defaultIconPosition,
  loading,
  longestText,
  onPress,
  size = defaultSize,
  style,
  variant = defaultVariant,
  ...rest
}) => {
  const color = useColor()

  const [current, setCurrent] = useState(DisplayState.Enabled)

  const getSize = (): { height: number; px: number } => {
    switch (size) {
      case "small":
        return { height: 30, px: 15 }
      case "large":
        return { height: 50, px: 30 }
    }
  }

  const loadingStyles = loading
    ? {
        backgroundColor: variant === "text" ? color("black10") : disabled ? color("black30") : color("blue100"),
        color: color("white100"),
        borderWidth: 0,
      }
    : {}

  const spinnerColor = variant === "text" ? "blue100" : "white100"

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress === undefined) {
      return
    }

    if (loading || disabled) {
      return
    }

    // Did someone tap really fast? Flick the highlighted state
    if (current === DisplayState.Enabled) {
      setCurrent(DisplayState.Highlighted)
      setTimeout(() => {
        setCurrent(DisplayState.Enabled)
      }, 0.3)
    } else {
      // Was already selected
      setCurrent(DisplayState.Enabled)
    }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(event)
  }

  const containerSize = getSize()
  const variantColors = getColorsForVariant(variant, disabled)

  const to = variantColors[current]
  const iconBox = <Box opacity={loading ? 0 : 1}>{icon}</Box>

  return (
    <Spring native to={to} config={{ config: config.stiff }}>
      {(springProps: ViewStyle & TextStyle) => (
        <TouchableWithoutFeedback
          onPress={handlePress}
          onPressIn={() => {
            setCurrent(DisplayState.Highlighted)
          }}
          onPressOut={() => {
            setCurrent(DisplayState.Enabled)
          }}
          disabled={disabled}
        >
          <Flex flexDirection="row">
            <AnimatedContainer
              {...rest}
              loading={loading}
              disabled={disabled}
              style={{ ...springProps, ...loadingStyles, height: containerSize.height }}
              px={containerSize.px}
            >
              <VisibleTextContainer>
                {iconPosition === "left" && iconBox}
                <Text
                  variant={size === "small" ? "small" : "mediumText"}
                  fontSize={size === "small" ? "13" : "16"}
                  style={{
                    color: loading ? "transparent" : springProps.color,
                    textDecorationLine: current === "hover" ? "underline" : "none",
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

              {!!loading && <Spinner size={size} color={spinnerColor} />}
            </AnimatedContainer>
          </Flex>
        </TouchableWithoutFeedback>
      )}
    </Spring>
  )
}

function getColorsForVariant(variant: ButtonVariant, disabled: boolean = false) {
  const color = useColor()

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
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: whiteWithOpacity,
        },
      }
    case "fillLight":
      return {
        default: {
          backgroundColor: whiteWithOpacity,
          borderColor: whiteWithOpacity,
          color: blackWithFullOpacity,
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: color("white100"),
        },
      }
    case "fillGray":
      return {
        default: {
          backgroundColor: black10WithOpacity,
          borderColor: black10WithOpacity,
          color: blackWithFullOpacity,
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: color("white100"),
        },
      }
    case "outline":
      return {
        default: {
          backgroundColor: color("white100"),
          borderColor: blackWithOpacity,
          color: blackWithOpacity,
        },
        hover: {
          backgroundColor: blueWithOpacity,
          borderColor: blueWithOpacity,
          color: color("white100"),
        },
      }
    case "text":
      return {
        default: {
          backgroundColor: color("white100"),
          borderColor: color("white100"),
          color: blackWithOpacity,
        },
        hover: {
          backgroundColor: color("black10"),
          borderColor: color("black10"),
          color: blueWithOpacity,
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
