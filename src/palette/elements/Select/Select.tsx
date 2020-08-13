import { themeGet } from "@styled-system/theme-get"
import React, { SFC } from "react"
import styled, { css } from "styled-components"
import {
  maxWidth,
  MaxWidthProps,
  minWidth,
  MinWidthProps,
  PositionProps,
  space as styledSpace,
  SpaceProps,
  width,
  WidthProps,
} from "styled-system"
import { color, space } from "../../helpers"
import { Box } from "../Box"
import { computeBorderColor, Required } from "../Input"
import { Sans, Serif } from "../Typography"

const computeOptionTags = (options: Option[], name?: string): JSX.Element[] => {
  const optionTags = options.map((option, index) => {
    const { text, value } = option
    const key = [name || "", value || index].join("-")

    return (
      <option value={value} key={key}>
        {text}
      </option>
    )
  })

  return optionTags
}

export interface Option {
  value: string
  text: string
}

export interface SelectProps
  extends PositionProps,
    SpaceProps,
    WidthProps,
    MaxWidthProps,
    MinWidthProps {
  description?: string
  disabled?: boolean
  error?: string
  name?: string
  onSelect?: (value) => void
  options: Option[]
  required?: boolean
  selected?: string
  title?: string
}

/**
 * A large drop-down select menu
 */
export const LargeSelect: SFC<SelectProps> = props => {
  const {
    description,
    disabled,
    error,
    name,
    onSelect,
    options,
    required,
    selected,
    title,
  } = props
  const optionTags = computeOptionTags(options, name)

  return (
    <Box width="100%">
      {title && (
        <Serif mb="0.5" size="3">
          {title}
          {required && <Required>*</Required>}
        </Serif>
      )}
      {description && (
        <Serif color="black60" mb="1" size="2">
          {description}
        </Serif>
      )}
      <LargeSelectContainer {...props} p={1}>
        <select
          disabled={disabled}
          name={name}
          onChange={event => onSelect && onSelect(event.target.value)}
          value={selected}
        >
          {optionTags}
        </select>
      </LargeSelectContainer>
      {error && (
        <Sans color="red100" mt="1" size="2">
          {error}
        </Sans>
      )}
    </Box>
  )
}

/**
 * A small version of drop-down select menu
 */
export const SelectSmall: SFC<SelectProps> = props => {
  const { disabled, onSelect, options, selected, title } = props
  const optionTags = computeOptionTags(options)

  return (
    <SelectSmallContainer {...props}>
      <label>
        {props.title && (
          <Sans size="2" display="inline" mr={0.5}>
            {title}:
          </Sans>
        )}
        <select
          disabled={disabled}
          onChange={event => onSelect && onSelect(event.target.value)}
          value={selected}
        >
          {optionTags}
        </select>
      </label>
    </SelectSmallContainer>
  )
}

const hideDefaultSkin = css`
  background: none;
  border: none;
  cursor: pointer;
  outline: 0;
  -webkit-appearance: none;

  -moz-appearance: none;
  text-indent: 0.01px;
  text-overflow: "";

  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }

  option:not(:checked) {
    color: black; /* prevent <option>s from becoming transparent as well */
  }
`
const carretSize = 4
const caretArrow = css<SelectProps>`
  border-left: ${carretSize}px solid transparent;
  border-right: ${carretSize}px solid transparent;
  border-top: ${carretSize}px solid
    ${props => (props.disabled ? color("black10") : color("black100"))};
  width: 0;
  height: 0;
`

const LargeSelectContainer = styled.div<SelectProps>`
  position: relative;
  width: 100%;

  select {
    width: 100%;
    ${maxWidth};
    ${minWidth};
    font-family: ${themeGet("fontFamily.serif.regular")};
    font-size: ${themeGet("typeSizes.serif.3.fontSize")};
    line-height: ${themeGet("typeSizes.serif.3t.lineHeight")};
    height: 40px;
    ${hideDefaultSkin};
    border: 1px solid
      ${({ disabled, error }) =>
        color(computeBorderColor({ disabled, error: !!error }))};
    border-radius: 0;
    transition: border-color 0.25s;
    padding-right: ${space(1)}px;
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    ${styledSpace};
    &:hover {
      border-color: ${({ disabled, error }) =>
        color(
          computeBorderColor({ disabled, error: !!error, pseudo: "hover" })
        )};
    }

    &:focus {
      border-color: ${({ disabled, error }) =>
        color(
          computeBorderColor({ disabled, error: !!error, pseudo: "focus" })
        )};
    }
  }

  &::after {
    content: "";
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    pointer-events: none;
    position: absolute;
    top: 45%;
    right: ${space(1)}px;

    ${caretArrow};
  }
`

const SelectSmallContainer = styled.div<SelectProps>`
  position: relative;

  label {
    ${width};
    ${maxWidth};
    ${minWidth};
    padding: 0;
    margin: 0;
  }

  select {
    ${hideDefaultSkin};
    background-color: ${color("black10")};
    border-radius: 2px;
    ${themeGet("fontFamily.sans.medium")};
    font-size: ${themeGet("typeSizes.sans.2.fontSize")};
    line-height: ${themeGet("typeSizes.sans.2.lineHeight")};
    padding: ${space(0.5)}px ${space(1) + carretSize * 4}px ${space(0.5)}px
      ${space(1)}px;
    ${styledSpace};
    ${width};
    ${maxWidth};
    ${minWidth};
    margin: 0;

    &:hover {
      background-color: ${color("black30")};
    }
    &:focus {
      border-color: ${color("purple100")};
    }
  }

  &::after {
    ${caretArrow};
    content: "";
    cursor: pointer;
    margin-left: -${space(1) + carretSize * 2}px;
    pointer-events: none;
    position: absolute;
    top: ${5 + space(0.5)}px;
  }
`
