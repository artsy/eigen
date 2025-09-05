import { Input, InputProps } from "@artsy/palette-mobile"
import { useBottomSheetInternal } from "@gorhom/bottom-sheet"
import { memo, useCallback, forwardRef } from "react"
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native"

const BottomSheetInputComponent = forwardRef<Input, InputProps>(
  ({ onFocus, onBlur, ...rest }, ref) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

    const handleOnFocus = useCallback(
      (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
        shouldHandleKeyboardEvents.value = true
        onFocus?.(args)
      },
      [onFocus, shouldHandleKeyboardEvents]
    )

    const handleOnBlur = useCallback(
      (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
        shouldHandleKeyboardEvents.value = false
        onBlur?.(args)
      },
      [onBlur, shouldHandleKeyboardEvents]
    )

    return <Input ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />
  }
)

export const BottomSheetInput = memo(BottomSheetInputComponent)
