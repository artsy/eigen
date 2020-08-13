import { themeGet } from "@styled-system/theme-get"
import React from "react"
import styled from "styled-components"
import { color, space } from "../../helpers"
import { Color } from "../../Theme"
import { Box } from "../Box"
import { Sans } from "../Typography"

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  description?: string
  disabled?: boolean
  error?: string
  required?: boolean
  title?: string
}

/**
 * Input component
 */
export const Input: React.ForwardRefExoticComponent<
  InputProps
> = React.forwardRef(
  ({ description, disabled, error, required, title, ...rest }, ref) => {
    return (
      <Box width="100%">
        {title && (
          <Sans mb="0.5" size="3">
            {title}
            {required && <Required>*</Required>}
          </Sans>
        )}
        {description && (
          <Sans color="black60" mb="1" size="2">
            {description}
          </Sans>
        )}
        <StyledInput
          ref={ref}
          disabled={disabled}
          error={!!error}
          {...rest as any}
        />
        {error && (
          <Sans color="red100" mt="1" size="2">
            {error}
          </Sans>
        )}
      </Box>
    )
  }
)

interface StyledInputProps extends React.HTMLProps<HTMLInputElement> {
  disabled: boolean
  error: boolean
}

interface InputStatus {
  disabled: boolean
  error: boolean
  pseudo?: string
}

/**
 * func to compute border color
 */
export const computeBorderColor = (inputStatus: InputStatus): Color => {
  const { disabled, error, pseudo } = inputStatus

  if (disabled) return "black10"
  if (error) return "red100"
  if (pseudo === "hover") return "black60"
  if (pseudo === "focus") return "purple100"
  return "black10"
}

const StyledInput = styled.input<StyledInputProps>`
  appearance: none;
  font-family: ${themeGet("fontFamily.sans.regular")};
  font-size: ${themeGet("typeSizes.sans.3.fontSize")};
  line-height: ${themeGet("typeSizes.sans.3t.lineHeight")};
  height: 40px;
  background-color: ${props =>
    props.disabled ? color("black5") : color("white100")};
  border: 1px solid
    ${({ disabled, error }) => color(computeBorderColor({ disabled, error }))};
  border-radius: 0;
  transition: border-color 0.25s;
  padding: ${space(1)}px;

  width: 100%;

  &:hover {
    border-color: ${({ disabled, error }) =>
      color(computeBorderColor({ disabled, error, pseudo: "hover" }))};
  }

  &:focus {
    border-color: ${({ disabled, error }) =>
      color(computeBorderColor({ disabled, error, pseudo: "focus" }))};
  }
`
StyledInput.displayName = "StyledInput"

/**
 * Required
 */
export const Required = styled.span`
  color: ${color("purple100")};
`
Required.displayName = "Required"
