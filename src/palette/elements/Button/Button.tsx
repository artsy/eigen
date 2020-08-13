import React, { Component } from "react"
import styled, { css } from "styled-components"
import { themeProps } from "../../Theme"
import { Spinner } from "../Spinner"
import { Sans, SansProps } from "../Typography"

import {
  borderRadius,
  borders,
  height,
  space,
  textAlign,
  width,
} from "styled-system"
import {
  ButtonBaseProps,
  ButtonProps,
  defaultSize,
  defaultVariant,
} from "./Button.shared"

export interface WebButtonProps extends ButtonProps {
  /** The underlying type of button */
  type?: string
}

/** A button with various size and color settings */
export class Button extends Component<WebButtonProps> {
  static defaultProps = {
    size: defaultSize,
    variant: defaultVariant,
    theme: themeProps,
  }

  getSize(): { height: string; size: "2" | "3t"; px: number } {
    const { inline } = this.props
    switch (this.props.size) {
      case "small":
        return {
          height: inline ? "17px" : "26px",
          size: "2",
          px: inline ? 0 : ("15px" as any),
        }
      case "medium":
        return {
          height: inline ? "21px" : "41px",
          size: "3t",
          px: inline ? 0 : 2,
        }
      case "large":
        return {
          height: inline ? "21px" : "50px",
          size: "3t",
          px: inline ? 0 : 3,
        }
    }
  }

  getVariant() {
    switch (this.props.variant) {
      case "primaryBlack":
        return css`
          ${props => {
            const { colors } = props.theme

            return `
                background-color: ${colors.black100};
                border-color: ${colors.black100};
                color: ${colors.white100};

                @media ${themeProps.mediaQueries.hover} {
                  &:hover {
                    background-color: ${colors.purple100};
                    border-color: ${colors.purple100};
                    color: ${colors.white100};
                  }
                }
              `
          }};
        `
      case "primaryWhite":
        return css`
          ${props => {
            const { colors } = props.theme

            return `
                background-color: ${colors.white100};
                border-color: ${colors.white100};
                color: ${colors.black100};

                @media ${themeProps.mediaQueries.hover} {
                  &:hover {
                    background-color: ${colors.purple100};
                    border-color: ${colors.purple100};
                    color: ${colors.white100};
                  }
                }
              `
          }};
        `
      case "secondaryGray":
        return css`
          ${props => {
            const { colors } = props.theme

            return `
                background-color: ${colors.black10};
                border-color: ${colors.black10};
                color: ${colors.black100};

                @media ${themeProps.mediaQueries.hover} {
                  &:hover {
                    background-color: ${colors.black30};
                    border-color: ${colors.black30};
                    color: ${colors.black100};
                  }
                }
              `
          }};
        `
      case "secondaryOutline":
        return css`
          ${props => {
            const { colors } = props.theme
            return `
                background-color: ${colors.white100};
                border-color: ${colors.black10};
                color: ${colors.black100};

                @media ${themeProps.mediaQueries.hover} {
                  &:hover {
                    background-color: ${colors.white100};
                    border-color: ${colors.black100};
                    color: ${colors.black100};
                  }
                }
              `
          }};
        `
      case "noOutline":
        return css`
          ${props => {
            const { colors } = props.theme
            return `
                background-color: transparent;
                border-color: transparent;
                color: ${colors.black100};
              `
          }};
        `
      default:
    }
  }

  render() {
    const buttonProps = {
      ...this.props,
      ...this.getSize(),
      buttonSize: this.props.size,
      variantStyles: this.getVariant(),
    }

    return <ButtonBase {...buttonProps}>{this.props.children}</ButtonBase>
  }
}

/** A base from which various button implementations can compose from */
export class ButtonBase extends Component<ButtonBaseProps & SansProps> {
  static defaultProps = {
    border: 1,
    borderRadius: 3,
  }

  onClick = event => {
    if (!this.props.loading && this.props.onClick) {
      this.props.onClick(event)
    }
  }

  render() {
    const {
      children,
      loading,
      disabled,
      color,
      size,
      longestText,
      weight,
      onClick,
      className,
      ...rest
    } = this.props

    const loadingClass = loading ? "loading" : ""
    const disabledClass = disabled ? "disabled" : ""

    return (
      <Container
        className={[loadingClass, disabledClass, className]
          .filter(Boolean)
          .join(" ")}
        onClick={this.onClick}
        disabled={disabled}
        {...rest}
      >
        {loading && <Spinner size={this.props.buttonSize} />}

        {longestText ? (
          <>
            <VisibleText
              pt="1px"
              weight={weight || "medium"}
              color={color}
              size={size}
            >
              {children}
            </VisibleText>
            <HiddenText
              role="presentation"
              pt="1px"
              weight={weight || "medium"}
              size={size}
            >
              {longestText}
            </HiddenText>
          </>
        ) : (
          <Sans pt="1px" weight={weight || "medium"} size={size}>
            {children}
          </Sans>
        )}
      </Container>
    )
  }
}

const VisibleText = styled(Sans)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const HiddenText = styled(Sans)`
  opacity: 0;
  pointer-events: none;
`

const Container = styled.button<ButtonBaseProps>`
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  ${borders};
  ${borderRadius};
  ${space};
  ${textAlign};
  ${width};
  ${height};

  ${props => {
    if (!props.loading) {
      return `
        transition: 0.25s ease;
      `
    }
  }};

  ${props => props.variantStyles};

  &.loading {
    transition: none;
    background-color: transparent;
    color: transparent;
    border: 0;
    cursor: auto;
  }

  &.disabled {
    ${props => {
      const { colors } = props.theme

      return `
        background-color: ${colors.black10};
        border-color: ${colors.black10};
        color: ${colors.white100};
        pointer-events: none;
      `
    }};
  }
`
