import SearchIcon from "lib/Icons/SearchIcon"
import { Flex, Sans } from "palette"
import React, { RefObject, useRef, useState } from "react"
import { LayoutAnimation, TextInput, TouchableOpacity } from "react-native"
import { ARef, Input, InputProps } from "./Input/Input"

interface SearchInputProps extends InputProps {
  enableCancelButton?: boolean
}

export const SearchInput = React.forwardRef<TextInput, SearchInputProps>(
  ({ enableCancelButton, onChangeText, onClear, value: parentValue, ...props }, ref) => {
    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef<ARef>()

    /**
     * Don't use `setOurValue`, use `localOnChangeText` instead.
     * That's because that way we can run the parent's `onChangeText`, which might be overriding `ourValue` anyway.
     * Only use `setOurValue` within the `localOnChangeText` function.
     */
    const [ourValue, setOurValue] = useState(props.defaultValue ?? "")
    const value = parentValue ?? ourValue

    const localOnChangeText = (text: string) => {
      setOurValue(text) // here we set our value
      onChangeText?.(text) // and here we run the parent's func to update their value, if they are using it.
    }

    return (
      <Flex flexDirection="row">
        <Input
          ref={inputRef}
          value={value}
          icon={<SearchIcon width={18} height={18} />}
          autoCorrect={false}
          enableClearButton
          returnKeyType="search"
          onClear={onClear}
          onChangeText={localOnChangeText}
          {...props}
          onFocus={(e) => {
            if (enableCancelButton) {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 180 })
            }
            setInputFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            if (enableCancelButton) {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 180 })
            }
            setInputFocused(false)
            props.onBlur?.(e)
          }}
        />
        {!!enableCancelButton && (
          <Flex alignItems="center" justifyContent="center" flexDirection="row">
            {!!inputFocused && (
              <TouchableOpacity
                onPress={() => {
                  ;(ref as RefObject<TextInput>).current?.blur()
                  localOnChangeText("")
                }}
                hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
              >
                <Flex pl={1}>
                  <Sans size="2" color="black60">
                    Cancel
                  </Sans>
                </Flex>
              </TouchableOpacity>
            )}
          </Flex>
        )}
      </Flex>
    )
  }
)
