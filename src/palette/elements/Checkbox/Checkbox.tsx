import React from "react"
import styled, { css } from "styled-components"
import { color, space } from "../../helpers"
import { Flex, FlexProps } from "../Flex"

import { CheckIcon } from "../../svgs"

import {
  BorderProps,
  borders,
  SizeProps,
  space as styledSpace,
  SpaceProps,
} from "styled-system"

/**
 * Spec: zpl.io/bAvnwlB
 */

const SIZE = 2
const BORDER_WIDTH = 2

export interface CheckboxProps {
  /** Disable checkbox interactions */
  disabled?: boolean
  /** Select the checkbox on render */
  selected?: boolean
  /** Show an error indicator */
  error?: boolean
  /** Used to force the checkbox into the visual hover state */
  hover?: boolean
  /** Callback when selected */
  onSelect?: (selected: boolean) => void
}

export interface CheckboxToggleProps
  extends CheckboxProps,
    BorderProps,
    SizeProps,
    SpaceProps {}

/**
 * A checkbox
 */
export class Checkbox extends React.Component<CheckboxProps> {
  labelColor = () => {
    const { disabled, error } = this.props
    if (disabled) return { color: color("black10") }
    if (error) return { color: color("red100") }
  }

  iconColor = () => {
    const { disabled, selected } = this.props
    if (disabled && selected) return "black30"
    if (disabled) return "black5"
    return "white100"
  }

  render() {
    const {
      selected,
      children,
      error,
      disabled,
      hover,
      onSelect,
      ...other
    } = this.props

    return (
      <Container
        className={hover && "hover"}
        my={0.5}
        onClick={() => !disabled && onSelect && onSelect(!selected)}
        selected={selected}
        hover={hover}
        disabled={disabled}
        alignItems="center"
        {...other}
      >
        <CheckboxButton
          border={1}
          mr={1}
          selected={selected}
          error={error}
          disabled={disabled}
        >
          <CheckIcon fill={this.iconColor()} />
        </CheckboxButton>
        <Label style={this.labelColor()}>{children}</Label>
      </Container>
    )
  }
}

interface CheckboxFeedbackState {
  disabled?: boolean
  selected?: boolean
  error?: boolean
}

const checkBorderColor = ({
  disabled,
  selected,
  error,
}: CheckboxFeedbackState) => {
  if (disabled) return color("black10")
  if (selected) return color("black100")
  if (error) return color("red100")
  return color("black10")
}

const checkBackgroundColor = ({
  disabled,
  selected,
}: CheckboxFeedbackState) => {
  switch (true) {
    case disabled:
      return color("black5")
    case selected:
      return color("black100")
    default:
      return color("white100")
  }
}

const CheckboxButton = styled.div<CheckboxToggleProps>`
  ${borders};
  ${styledSpace};
  background-color: ${checkBackgroundColor};
  border-color: ${checkBorderColor};
  width: ${space(SIZE)}px;
  height: ${space(SIZE)}px;
  transition: background-color 0.25s, border-color 0.25s;

  svg {
    position: relative;
    top: -${BORDER_WIDTH}px;
    left: -${BORDER_WIDTH}px;
  }
`

const Label = styled.div``

const hoverStyles = ({ selected, hover, disabled }) => {
  const styles = `
    background-color: ${color("black10")};
    border-color: ${color("black10")};
  `
  if (hover && !selected && !disabled) {
    return css`
      ${CheckboxButton} {
        ${styles};
      }
    `
  }
  if (!selected && !disabled) {
    return css`
      &:hover ${CheckboxButton} {
        ${styles};
      }
    `
  }
}

interface ContainerProps extends FlexProps {
  selected: boolean
  hover: boolean
  disabled: boolean
}
const Container = styled(Flex)<ContainerProps>`
  user-select: none;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  transition: color 0.25s;
  ${hoverStyles};
`
