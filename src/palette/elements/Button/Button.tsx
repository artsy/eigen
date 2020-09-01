import React, { ReactNode, useState } from "react"
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import { SansSize, themeProps } from "../../Theme"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { Sans } from "../Typography"

/** Different theme variations */
export type ButtonVariant = "primaryBlack" | "primaryWhite" | "secondaryGray" | "secondaryOutline" | "noOutline"
/** Default button color variant */
export const defaultVariant: ButtonVariant = "primaryBlack"

/** The size of the button */
export type ButtonSize = "small" | "medium" | "large"

/** Default button size */
export const defaultSize: ButtonSize = "medium"

export interface ButtonProps extends ButtonBaseProps {
  children: ReactNode
  /** The size of the button */
  size?: ButtonSize
  /** The theme of the button */
  variant?: ButtonVariant
  /** React Native only, Callback on press, use instead of onClick */
  onPress?: (event: GestureResponderEvent) => void
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
export function getColorsForVariant(variant: ButtonVariant) {
  const {
    colors: { black100, black10, black30, white100, purple100 },
  } = themeProps

  switch (variant) {
    case "primaryBlack":
      return {
        default: {
          backgroundColor: black100,
          borderColor: black100,
          color: white100,
        },
        hover: {
          backgroundColor: purple100,
          borderColor: purple100,
          color: white100,
        },
      }
    case "primaryWhite":
      return {
        default: {
          backgroundColor: white100,
          borderColor: white100,
          color: black100,
        },
        hover: {
          backgroundColor: purple100,
          borderColor: purple100,
          color: white100,
        },
      }
    case "secondaryGray":
      return {
        default: {
          backgroundColor: black10,
          borderColor: black10,
          color: black100,
        },
        hover: {
          backgroundColor: black30,
          borderColor: black30,
          color: black100,
        },
      }
    case "secondaryOutline":
      return {
        default: {
          backgroundColor: white100,
          borderColor: black10,
          color: black100,
        },
        hover: {
          backgroundColor: white100,
          borderColor: black100,
          color: black100,
        },
      }
    case "noOutline":
      return {
        default: {
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
          color: black100,
        },
        hover: {
          backgroundColor: white100,
          borderColor: black100,
          color: black100,
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
export const Button: React.FC<ButtonProps> = props => {
  const size = props.size ?? defaultSize
  const variant = props.variant ?? defaultVariant

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
    if (!props.loading) {
      return {}
    }

    if (props.inline) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "rgba(0, 0, 0, 0)",
        borderWidth: 0,
      }
    }

    const { black100 } = themeProps.colors

    return {
      backgroundColor: black100,
      borderColor: black100,
      color: "rgba(0, 0, 0, 0)",
    }
  })()

  const spinnerColor = (() => {
    if (props.inline) {
      return variant === "primaryWhite" ? "white100" : "black100"
    }

    return "white100"
  })()

  const onPress = (event: GestureResponderEvent) => {
    if (props.onPress) {
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

      props.onPress(event)
    }
  }

  const { children, loading, disabled, inline, longestText, ...rest } = props
  const s = getSize()
  const variantColors = getColorsForVariant(variant)
  const opacity = props.disabled ? 0.1 : 1.0

  const from = variantColors[previous]
  const to = variantColors[current]

  return (
    <Spring native from={from} to={to}>
      {// @ts-ignore STRICTNESS_MIGRATION
      springProps => (
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
              style={{ ...springProps, ...loadingStyles, height: s.height, opacity }}
              px={s.px}
            >
              <VisibleTextContainer>
                <Sans weight="medium" color={loadingStyles.color || to.color} size={s.size}>
                  {children}
                </Sans>
              </VisibleTextContainer>
              <HiddenText role="presentation" weight="medium" size={s.size}>
                {longestText ? longestText : children}
              </HiddenText>

              {!!loading && <Spinner size={size} color={spinnerColor} />}
            </AnimatedContainer>
          </Flex>
        </TouchableWithoutFeedback>
      )}
    </Spring>
  )
}

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

const HiddenText = styled(Sans)`
  opacity: 0;
`

const Container = styled(Box)<ButtonProps>`
  align-items: center;
  justify-content: center;
  position: relative;
  border-width: 1;
  border-radius: 3;
  width: ${p => (p.block ? "100%" : "auto")};
`

const AnimatedContainer = animated(Container)
