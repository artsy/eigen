import SearchIcon from "lib/Icons/SearchIcon"
import { Box, Flex, Input, InputProps, Sans } from "palette"
import React, { RefObject, useCallback, useState } from "react"
import { Dimensions, LayoutChangeEvent, TextInput, TouchableOpacity } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./StickyTabPage/reanimatedHelpers"

const INPUT_INDENT = 40

interface SearchInputProps extends InputProps {
  enableCancelButton?: boolean
  onCancelPress?: () => void
}

export const SearchInput = React.forwardRef<TextInput, SearchInputProps>(
  ({ enableCancelButton, onChangeText, onClear, onCancelPress, ...props }, ref) => {
    const [inputFocused, setInputFocused] = useState(false)
    const [cancelButtonWidth, setCancelButtonWidth] = useState(0)
    const animationValue = useAnimatedValue(0)
    const screenWidth = Dimensions.get("window").width
    const inputFullWidth = screenWidth - INPUT_INDENT
    const shrinkedWidth = inputFullWidth - cancelButtonWidth

    const handleCancelButtonLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
      setCancelButtonWidth(nativeEvent.layout.width)
    }, [])

    return (
      <Flex flexDirection="row">
        <Input
          ref={ref}
          icon={<SearchIcon width={18} height={18} />}
          autoCorrect={false}
          enableClearButton
          returnKeyType="search"
          onClear={onClear}
          onChangeText={onChangeText}
          animationValue={animationValue}
          width={inputFullWidth}
          shrinkedWidth={shrinkedWidth}
          {...props}
          onFocus={(e) => {
            setInputFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setInputFocused(false)
            props.onBlur?.(e)
          }}
        />
        {!!enableCancelButton && (
          <Flex alignItems="center" justifyContent="center" flexDirection="row">
            {!!inputFocused && (
              <Box onLayout={handleCancelButtonLayout}>
                <TouchableOpacity
                  onPress={() => {
                    ;(ref as RefObject<TextInput>).current?.blur()
                    ;(ref as RefObject<TextInput>).current?.clear()
                    onCancelPress?.()
                  }}
                  hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
                >
                  <Animated.View
                    style={[
                      {
                        transform: [
                          {
                            translateX: animationValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [cancelButtonWidth - INPUT_INDENT, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Flex pl={1}>
                      <Sans size="2" color="black60">
                        Cancel
                      </Sans>
                    </Flex>
                  </Animated.View>
                </TouchableOpacity>
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    )
  }
)
