import React, { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { animated, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import { themeProps } from "../../Theme"
import { Box } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { Sans } from "../Typography"
import {
  ButtonProps,
  defaultSize,
  defaultVariant,
  getColorsForVariant,
} from "./Button.shared"

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
    const {
      children,
      loading,
      disabled,
      inline,
      longestText,
      ...rest
    } = this.props
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
                  <Sans
                    weight="medium"
                    color={this.loadingStyles.color || to.color}
                    size={size}
                  >
                    {children}
                  </Sans>
                </VisibleTextContainer>
                <HiddenText role="presentation" weight="medium" size={size}>
                  {longestText ? longestText : children}
                </HiddenText>

                {loading && (
                  <Spinner size={this.props.size} color={this.spinnerColor} />
                )}
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
