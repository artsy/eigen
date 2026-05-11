import { Input, InputProps, InputRef } from "@artsy/palette-mobile"
import { useBottomSheetInternal } from "@gorhom/bottom-sheet"
import { forwardRef, memo, useCallback, useRef } from "react"
import { FocusEvent } from "react-native"

const BottomSheetInputComponent = forwardRef<InputRef, InputProps>(
  ({ onFocus, onBlur, ...rest }, providedRef) => {
    const targetRef = useRef<number | undefined>(undefined)
    const { animatedKeyboardState, textInputNodesRef } = useBottomSheetInternal()

    const handleOnFocus = useCallback(
      (args: FocusEvent) => {
        const target = args.nativeEvent.target
        targetRef.current = target

        textInputNodesRef.current.add(target)

        animatedKeyboardState.set((state) => ({
          ...state,
          target,
        }))
        onFocus?.(args)
      },
      [onFocus, animatedKeyboardState, textInputNodesRef]
    )

    const handleOnBlur = useCallback(
      (args: FocusEvent) => {
        const target = args.nativeEvent.target
        const keyboardState = animatedKeyboardState.get()

        const shouldRemoveCurrentTarget = keyboardState.target === target

        if (shouldRemoveCurrentTarget) {
          animatedKeyboardState.set((state) => ({
            ...state,
            target: undefined,
          }))
        }

        if (targetRef.current !== undefined) {
          textInputNodesRef.current.delete(targetRef.current)
          targetRef.current = undefined
        }

        onBlur?.(args)
      },
      [onBlur, animatedKeyboardState, textInputNodesRef]
    )

    return <Input ref={providedRef} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />
  }
)

export const BottomSheetInput = memo(BottomSheetInputComponent)
