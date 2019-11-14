import { color, Color, Flex, Sans, Serif, space, Spacer } from "@artsy/palette"
import { fontFamily } from "@artsy/palette/dist/platform/fonts/fontFamily"
import React, { useImperativeHandle, useRef, useState } from "react"
import { TextInput, TextInputProps, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

const INPUT_HEIGHT = 40

export interface InputProps {
  description?: string
  disabled?: boolean
  error?: string
  required?: boolean
  title?: string
  icon?: JSX.Element
}

export type Input = TextInput
/**
 * Input component
 */
export const Input = React.forwardRef<TextInput, InputProps & TextInputProps>(
  ({ description, disabled, error, required, title, icon, ...rest }, ref) => {
    const [focused, setFocused] = useState(false)
    const input = useRef<TextInput>()
    useImperativeHandle(ref, () => input.current)
    return (
      <Flex flexGrow={1}>
        {title && (
          <Serif mb={0.5} size="3">
            {title}
            {required && <Required>*</Required>}
          </Serif>
        )}
        {description && (
          <Serif color="black60" mb={1} size="2">
            {description}
          </Serif>
        )}
        <TouchableWithoutFeedback onPressIn={() => input.current.focus()}>
          <InputWrapper focused={focused} disabled={disabled} error={!!error}>
            {icon}
            {icon && <Spacer ml={1} />}
            <StyledInput
              ref={input}
              placeholderTextColor={color("black60")}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ flex: 1 }}
              {...rest as any}
            />
          </InputWrapper>
        </TouchableWithoutFeedback>
        {error && (
          <Sans color="red100" mt="1" size="2">
            {error}
          </Sans>
        )}
      </Flex>
    )
  }
)

interface StyledInputProps {
  disabled: boolean
  error: boolean
}

interface InputStatus {
  disabled: boolean
  error: boolean
  focused: boolean
}

/**
 * func to compute border color
 */
export const computeBorderColor = (inputStatus: InputStatus): Color => {
  const { disabled, error, focused } = inputStatus

  if (disabled) {
    return "black10"
  }
  if (error) {
    return "red100"
  }
  if (focused) {
    return "purple100"
  }
  return "black10"
}

const InputWrapper = styled(Flex)`
  flex-direction: row;
  align-items: center;
  border: 1px solid ${({ disabled, error, focused }) => color(computeBorderColor({ disabled, error, focused }))};
  height: ${INPUT_HEIGHT}px;
  padding: ${space(1)}px;
  background-color: ${props => (props.disabled ? color("black5") : color("white100"))};
`

const StyledInput: typeof TextInput = styled.TextInput<StyledInputProps>`
  padding: 0;
  margin: 0;
  font-family: ${fontFamily.serif.regular};
`
// @ts-ignore
StyledInput.displayName = "StyledInput"

/**
 * Required
 */
export const Required = styled(Sans).attrs({ color: color("purple100") })``
Required.displayName = "Required"
