import {
  Flex,
  Input2,
  Input2Props,
  Input2Ref,
  SpacingUnitDSValueNumber,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { INPUT_HEIGHT, InputRef } from "app/Components/Input"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import Animated, {
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"

const MX = 2
const CANCEL_BUTTON_DURATION = 180

export interface SearchInputProps extends Input2Props {
  mx?: SpacingUnitDSValueNumber
  enableCancelButton?: boolean
  onCancelPress?: () => void
}

export const SearchInput = forwardRef<InputRef, SearchInputProps>(
  ({ enableCancelButton, onChangeText, onClear, onCancelPress, mx = MX, ...props }, ref) => {
    const [cancelWidth, setCancelWidth] = useState(0)
    const space = useSpace()
    const [cancelButtonShown, setCancelButtonShown] = useState(false)
    const width = useWindowDimensions().width - space(mx) * 2

    const shrinkAnim = useAnimatedStyle(() => {
      "worklet"
      return {
        width: withTiming(width - (cancelButtonShown ? cancelWidth : 0), {
          duration: CANCEL_BUTTON_DURATION,
        }),
      }
    }, [cancelButtonShown, cancelWidth])

    const inputRef = useRef<Input2Ref>(null)
    useImperativeHandle(ref, () => inputRef.current as Input2Ref)

    return (
      <Flex flexDirection="row">
        <Animated.View style={[shrinkAnim, { paddingTop: 2 }]}>
          <Input2
            ref={inputRef}
            icon={<SearchIcon width={18} height={18} />}
            autoCorrect={false}
            enableClearButton
            returnKeyType="search"
            onClear={() => {
              onClear?.()
              inputRef?.current?.focus()
            }}
            // We only support up to 100 chars search in our backend,
            // anything above that would lead to an error
            maxLength={100}
            onChangeText={onChangeText}
            {...props}
            onFocus={(e) => {
              setCancelButtonShown(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setCancelButtonShown(false)
              props.onBlur?.(e)
            }}
          />
        </Animated.View>
        <Flex alignItems="center" justifyContent="center" maxHeight={INPUT_HEIGHT + 3}>
          {!!enableCancelButton && !!cancelButtonShown && (
            <Animated.View
              entering={FadeInRight.duration(CANCEL_BUTTON_DURATION)}
              exiting={FadeOutRight.duration(CANCEL_BUTTON_DURATION)}
            >
              <TouchableOpacity
                onPress={() => {
                  inputRef?.current?.clear()
                  inputRef?.current?.blur()
                  setCancelButtonShown(false)
                  onCancelPress?.()
                }}
                hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
                onLayout={(e) => {
                  setCancelWidth(e.nativeEvent.layout.width)
                }}
              >
                <Text pl={1} variant="xs" color="black60">
                  Cancel
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Flex>
      </Flex>
    )
  }
)
