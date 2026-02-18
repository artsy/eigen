import { Input, InputProps } from "@artsy/palette-mobile"
import { useBottomSheetInternal } from "@gorhom/bottom-sheet"
import { forwardRef, memo, useCallback } from "react"
import { BlurEvent, FocusEvent } from "react-native"

const BottomSheetInputComponent = forwardRef<Input, InputProps>(
  ({ onFocus, onBlur, ...rest }, ref) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

    const handleOnFocus = useCallback(
      (args: FocusEvent) => {
        shouldHandleKeyboardEvents.value = true
        onFocus?.(args)
      },
      [onFocus, shouldHandleKeyboardEvents]
    )

    const handleOnBlur = useCallback(
      (args: BlurEvent) => {
        shouldHandleKeyboardEvents.value = false
        onBlur?.(args)
      },
      [onBlur, shouldHandleKeyboardEvents]
    )

    return <Input ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />
  }
)

export const BottomSheetInput = memo(BottomSheetInputComponent)
