import { Input2, Input2Props } from "@artsy/palette-mobile"
import { useBottomSheetInternal } from "@gorhom/bottom-sheet"
import { memo, useCallback, forwardRef } from "react"

const BottomSheetInputComponent = forwardRef<Input2, Input2Props>(
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

    return <Input2 ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />
  }
)

export const BottomSheetInput = memo(BottomSheetInputComponent)
