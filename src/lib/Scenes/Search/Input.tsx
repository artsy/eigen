import { color, Color, Flex, Sans, space, Spacer, XCircleIcon } from "@artsy/palette"
import { fontFamily } from "@artsy/palette/dist/platform/fonts/fontFamily"
import React, { useImperativeHandle, useRef, useState } from "react"
import { Text, TextInput, TextInputProps, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

const INPUT_HEIGHT = 40

export interface InputProps {
  description?: string
  disabled?: boolean
  error?: string
  required?: boolean
  title?: string
  icon?: JSX.Element
  showClearButton?: boolean
  onClear?(): void
}

export type Input = TextInput
/**
 * Input component
 */
export const Input = React.forwardRef<TextInput, InputProps & TextInputProps>(
  ({ description, disabled, error, required, title, showClearButton, icon, ...rest }, ref) => {
    const [focused, setFocused] = useState(false)
    const [value, setValue] = useState(rest.defaultValue || "")
    const input = useRef<TextInput>()
    useImperativeHandle(ref, () => input.current!)
    return (
      <Flex flexGrow={1}>
        {title && (
          <Sans mb={0.5} size="3">
            {title}
            {required && <Text style={{ color: color("purple100") }}>*</Text>}
          </Sans>
        )}
        {description && (
          <Sans color="black60" mb={1} size="2">
            {description}
          </Sans>
        )}
        <TouchableWithoutFeedback onPressIn={() => input.current?.focus()}>
          <InputWrapper focused={focused} disabled={disabled} error={!!error}>
            {icon}
            {icon && <Spacer ml={1} />}
            <StyledInput
              ref={input}
              placeholderTextColor={color("black60")}
              style={{ flex: 1 }}
              {...(rest as any)}
              onChangeText={text => {
                setValue(text)
                rest.onChangeText?.(text)
              }}
              onFocus={e => {
                setFocused(true)
                rest.onFocus?.(e)
              }}
              onBlur={e => {
                setFocused(false)
                rest.onBlur?.(e)
              }}
            />
            {Boolean(value) && showClearButton && (
              <TouchableOpacity
                onPress={() => {
                  input.current?.clear()
                  setValue("")
                  rest.onChangeText?.("")
                  rest.onClear?.()
                }}
                hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
              >
                <XCircleIcon fill="black30" />
              </TouchableOpacity>
            )}
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
  disabled?: boolean
  error?: boolean
  focused?: boolean
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
  border: 1px solid
    ${({ disabled, error, focused }: { disabled?: boolean; error?: boolean; focused?: boolean }) =>
      color(computeBorderColor({ disabled, error, focused }))};
  height: ${INPUT_HEIGHT}px;
  padding: ${space(1)}px;
  background-color: ${props => (props.disabled ? color("black5") : color("white100"))};
`

const StyledInput = styled.TextInput<StyledInputProps>`
  padding: 0;
  margin: 0;

  /* to center the text */
  margin-top: 1px;
  font-family: ${fontFamily.sans.regular as string};
`
StyledInput.displayName = "StyledInput"
