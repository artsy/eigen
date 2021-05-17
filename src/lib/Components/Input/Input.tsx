import { color, Color, EyeOpenedIcon, Flex, Sans, TEXT_FONTS, XCircleIcon } from "palette"
import { fontFamily } from "palette/platform/fonts/fontFamily"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import {
  LayoutAnimation,
  Platform,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import styled from "styled-components/native"
import { EyeClosedIcon } from "../../../palette/svgs/EyeClosedIcon"
import { InputTitle } from "./InputTitle"

export const INPUT_HEIGHT = 43

export interface InputProps extends TextInputProps {
  containerStyle?: React.ComponentProps<typeof Flex>["style"]
  description?: string
  error?: string
  icon?: JSX.Element
  disabled?: boolean
  required?: boolean
  title?: string
  enableClearButton?: boolean
  canHidePassword?: boolean
  inputTextStyle?: TextStyle
  onClear?(): void
  renderLeftHandSection?(): JSX.Element
}

export type Input = TextInput
/**
 * Input component
 */
export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      containerStyle,
      description,
      disabled,
      error,
      icon,
      required,
      enableClearButton,
      title,
      renderLeftHandSection,
      secureTextEntry = false,
      textContentType,
      canHidePassword,
      inputTextStyle,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(!secureTextEntry)
    const [value, setValue] = useState(rest.value ?? rest.defaultValue ?? "")
    const input = useRef<TextInput>()
    useImperativeHandle(ref, () => input.current!)

    useEffect(() => {
      /*To make the font work for secure text inputs, see https://github.com/facebook/react-native/issues/30123#issuecomment-711076098*/
      input.current?.setNativeProps({
        style: { fontFamily: TEXT_FONTS.sans },
      })
    }, [])

    const renderShowPasswordIcon = () => {
      if (!secureTextEntry) {
        return
      }
      return (
        <Flex pr="1" justifyContent="center" flexGrow={0}>
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword)
            }}
            hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
          >
            {!showPassword ? <EyeClosedIcon fill="black30" /> : <EyeOpenedIcon fill="black60" />}
          </TouchableOpacity>
        </Flex>
      )
    }
    return (
      <Flex flexGrow={1} style={containerStyle}>
        <InputTitle required={required}>{title}</InputTitle>

        {!!description && (
          <Sans color="black60" mb={1} size="2">
            {description}
          </Sans>
        )}
        <TouchableWithoutFeedback onPressIn={() => input.current?.focus()}>
          <View
            style={[
              rest.style,
              {
                flexDirection: "row",
                borderWidth: 1,
                borderColor: color(computeBorderColor({ disabled, error: !!error, focused })),
                height: INPUT_HEIGHT,
                backgroundColor: disabled ? color("black5") : color("white100"),
              },
            ]}
          >
            {renderLeftHandSection?.()}
            {!!icon && (
              <Flex pl="1" justifyContent="center" flexGrow={0}>
                {icon}
              </Flex>
            )}
            <Flex flexGrow={1}>
              <StyledInput
                ref={input}
                placeholderTextColor={color("black60")}
                style={{ flex: 1, fontSize: 15, ...inputTextStyle }}
                secureTextEntry={!showPassword}
                textAlignVertical="center"
                {...(rest as any)}
                onChangeText={(text) => {
                  setValue(text)
                  rest.onChangeText?.(text)
                }}
                onFocus={(e) => {
                  if (Platform.OS === "android") {
                    LayoutAnimation.configureNext(LayoutAnimation.create(60, "easeInEaseOut", "opacity"))
                  }
                  setFocused(true)
                  rest.onFocus?.(e)
                }}
                onBlur={(e) => {
                  if (Platform.OS === "android") {
                    LayoutAnimation.configureNext(LayoutAnimation.create(60, "easeInEaseOut", "opacity"))
                  }
                  setFocused(false)
                  rest.onBlur?.(e)
                }}
              />
            </Flex>
            {renderShowPasswordIcon()}
            {!!(Boolean(value) && enableClearButton) && (
              <Flex pr="1" justifyContent="center" flexGrow={0}>
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
              </Flex>
            )}
          </View>
        </TouchableWithoutFeedback>
        {!!error && (
          <Sans color="red100" mt="1" size="2">
            {error}
          </Sans>
        )}
      </Flex>
    )
  }
)

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
    return "black100"
  }
  return "black10"
}

const StyledInput = styled(TextInput)`
  padding: 0;
  margin: 0;

  /* to make sure the KeyboardAvoidingView keeps some padding below the input */
  position: absolute;
  left: 10;
  right: 10;
  top: ${Platform.OS === "ios" ? 12 : 6}; /* to center the text nicely */
  padding-bottom: 30;

  /* to center the text */
  font-family: ${fontFamily.sans.regular.normal};
`
StyledInput.displayName = "StyledInput"
