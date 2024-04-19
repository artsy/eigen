import { Input, InputProps } from "@artsy/palette-mobile"
import { useBottomSheetInternal } from "@gorhom/bottom-sheet"
import { memo, useCallback, forwardRef } from "react"

const BottomSheetInputComponent = forwardRef<Input, InputProps>(
  ({ onFocus, onBlur, ...rest }, ref) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

    const handleOnFocus = useCallback(
      (args) => {
        shouldHandleKeyboardEvents.value = true
        onFocus?.(args)
      },
      [onFocus, shouldHandleKeyboardEvents]
    )

    const handleOnBlur = useCallback(
      (args) => {
        shouldHandleKeyboardEvents.value = false
        onBlur?.(args)
      },
      [onBlur, shouldHandleKeyboardEvents]
    )

    return <Input ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />
  }
)

export const BottomSheetInput = memo(BottomSheetInputComponent)
