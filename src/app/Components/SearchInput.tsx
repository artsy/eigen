import SearchIcon from "app/Icons/SearchIcon"
import {
  emitInputClearEvent,
  Flex,
  Input,
  InputProps,
  Sans,
  SpacingUnitV2,
  SpacingUnitV3,
  useSpace,
} from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { TextInput, TouchableOpacity, useWindowDimensions } from "react-native"
import Animated, { Easing } from "react-native-reanimated"
import { useAnimatedValue } from "./StickyTabPage/reanimatedHelpers"

const MX = 2

export interface SearchInputProps extends InputProps {
  mx?: SpacingUnitV2 | SpacingUnitV3
  enableCancelButton?: boolean
  onCancelPress?: () => void
}

export const SearchInput = React.forwardRef<TextInput, SearchInputProps>(
  (
    { enableCancelButton, onChangeText, onClear, onCancelPress, mx = MX, ...props },
    ref: React.Ref<Partial<TextInput>>
  ) => {
    const cancelWidth = useAnimatedValue(0)
    const animationValue = useAnimatedValue(0)
    const space = useSpace()
    const width = useWindowDimensions().width - space(mx) * 2
    const inputWidth = Animated.sub(width, cancelWidth)
    const inputRef = useRef<TextInput>(null)

    const animateTo = (toValue: 1 | 0) => {
      Animated.timing(animationValue, {
        toValue,
        easing: Easing.inOut(Easing.ease),
        duration: 180,
      }).start()
    }

    useImperativeHandle(ref, () => inputRef?.current ?? {})

    return (
      <Flex flexDirection="row">
        <Animated.View
          style={{
            width: enableCancelButton
              ? animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, inputWidth],
                })
              : inputWidth,
          }}
        >
          <Input
            ref={inputRef}
            icon={<SearchIcon width={18} height={18} />}
            autoCorrect={false}
            enableClearButton
            returnKeyType="search"
            addClearListener
            onClear={() => {
              onClear?.()
              inputRef?.current?.focus()
            }}
            onChangeText={onChangeText}
            {...props}
            onFocus={(e) => {
              animateTo(1)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              animateTo(0)
              props.onBlur?.(e)
            }}
          />
        </Animated.View>
        {!!enableCancelButton && (
          <Animated.View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onLayout={Animated.event([{ nativeEvent: { layout: { width: cancelWidth } } }])}
          >
            <TouchableOpacity
              onPress={() => {
                emitInputClearEvent()
                inputRef?.current?.blur()
                onCancelPress?.()
              }}
              hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
            >
              <Animated.Text
                style={[
                  {
                    paddingLeft: space(1),
                    opacity: animationValue,
                    transform: [
                      {
                        translateX: animationValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [cancelWidth, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Sans size="2" color="black60">
                  Cancel
                </Sans>
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Flex>
    )
  }
)
