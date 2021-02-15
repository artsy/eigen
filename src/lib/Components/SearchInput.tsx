import SearchIcon from "lib/Icons/SearchIcon"
import { Flex, Sans } from "palette"
import React, { RefObject, useState } from "react"
import { LayoutAnimation, TextInput, TouchableOpacity } from "react-native"
import { Input, InputProps } from "./Input/Input"

interface SearchInputProps extends InputProps {
  enableCancelButton?: boolean
}

export const SearchInput = React.forwardRef<TextInput, SearchInputProps>(({ enableCancelButton, ...props }, ref) => {
  const [inputFocused, setInputFocused] = useState(false)
  return (
    <Flex flexDirection="row">
      <Input
        ref={ref}
        icon={<SearchIcon width={18} height={18} />}
        autoCorrect={false}
        enableClearButton
        returnKeyType="search"
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
              }}
              hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
            >
              <Flex pl="1">
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
})
