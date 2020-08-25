import React, { Component, ReactNode } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { animated, Spring } from "react-spring/renderprops-native.cjs"
import { css } from "styled-components"
import styled from "styled-components/native"
import { themeProps } from "../../Theme"
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
  onPress?: (e) => void
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
  /** Callback on click */
  onClick?: (e) => void
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
    default:
  }
}

/**
 * Returns css related to the passed in variant
 * @param variant
 */
export const getStylesForVariant = (variant: ButtonVariant) => {
  const { default: enabled, hover } = getColorsForVariant(variant)

  return css`
    ${() => {
      return `
          background-color: ${enabled.backgroundColor};
          border-color: ${enabled.borderColor};
          color: ${enabled.color};

          @media ${themeProps.mediaQueries.hover} {
            &:hover {
              background-color: ${hover.backgroundColor};
              border-color: ${hover.borderColor};
              color: ${hover.color};
            }
          }
        `
    }};
  `
}

enum DisplayState {
  Enabled = "default",
  Highlighted = "hover",
  Disabled = "default",
}

interface ButtonState {
  previous: DisplayState
  current: DisplayState
}

/** A button with various size and color settings */
export class Button extends Component<ButtonProps, ButtonState> {
  static defaultProps = {
    size: defaultSize,
    variant: defaultVariant,
    theme: themeProps,
  }

  state = {
    previous: DisplayState.Enabled,
    current: DisplayState.Enabled,
  }

  getSize(): { height: number | string; size: "2" | "3t"; px: number } {
    const { inline } = this.props
    switch (this.props.size) {
      case "small":
        return { height: inline ? 17 : 26, size: "2", px: inline ? 0 : 1 }
      case "medium":
        return { height: inline ? 21 : 41, size: "3t", px: inline ? 0 : 2 }
      case "large":
        return { height: inline ? 21 : 50, size: "3t", px: inline ? 0 : 3 }
    }
  }

  get loadingStyles() {
    const { inline, loading } = this.props

    if (!loading) {
      return {}
    }

    if (inline) {
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
  }

  get spinnerColor() {
    const { inline, variant } = this.props

    if (inline) {
      return variant === "primaryWhite" ? "white100" : "black100"
    }

    return "white100"
  }

  onPress = args => {
    if (this.props.onPress) {
      // Did someone tap really fast? Flick the highlighted state
      const { current } = this.state

      if (this.state.current === DisplayState.Enabled) {
        this.setState({
          previous: current,
          current: DisplayState.Highlighted,
        })
        setTimeout(
          () =>
            this.setState({
              previous: current,
              current: DisplayState.Enabled,
            }),
          0.3
        )
      } else {
        // Was already selected
        this.setState({ current: DisplayState.Enabled })
      }

      this.props.onPress(args)
    }
  }

  render() {
    const { children, loading, disabled, inline, longestText, ...rest } = this.props
    const { px, size, height } = this.getSize()
    const variantColors = getColorsForVariant(this.props.variant)
    const opacity = this.props.disabled ? 0.1 : 1.0

    const { current, previous } = this.state

    const from = variantColors[previous]
    const to = variantColors[current]

    return (
      <Spring native from={from} to={to}>
        {props => (
          <TouchableWithoutFeedback
            onPress={this.onPress}
            onPressIn={() => {
              this.setState({
                previous: DisplayState.Enabled,
                current: DisplayState.Highlighted,
              })
            }}
            onPressOut={() => {
              this.setState({
                previous: DisplayState.Highlighted,
                current: DisplayState.Enabled,
              })
            }}
            disabled={disabled}
          >
            <Flex flexDirection="row">
              <AnimatedContainer
                {...rest}
                loading={loading}
                disabled={disabled}
                style={{ ...props, ...this.loadingStyles, height, opacity }}
                px={px}
              >
                <VisibleTextContainer>
                  <Sans weight="medium" color={this.loadingStyles.color || to.color} size={size}>
                    {children}
                  </Sans>
                </VisibleTextContainer>
                <HiddenText role="presentation" weight="medium" size={size}>
                  {longestText ? longestText : children}
                </HiddenText>

                {!!loading && <Spinner size={this.props.size} color={this.spinnerColor} />}
              </AnimatedContainer>
            </Flex>
          </TouchableWithoutFeedback>
        )}
      </Spring>
    )
  }
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
