import { forwardRef } from "react"
import { ScrollViewProps } from "react-native"
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller"

interface KeyboardAwareFormProps extends ScrollViewProps {
  bottomOffset?: number
  extraKeyboardSpace?: number
  enabled?: boolean
  disableScrollOnKeyboardHide?: boolean
}

export const KeyboardAwareForm = forwardRef<KeyboardAwareScrollViewRef, KeyboardAwareFormProps>(
  (
    {
      children,
      contentContainerStyle,
      bottomOffset = 40,
      extraKeyboardSpace,
      enabled = true,
      disableScrollOnKeyboardHide,
      keyboardDismissMode = "on-drag",
      keyboardShouldPersistTaps = "handled",
      ...scrollViewProps
    },
    ref
  ) => {
    return (
      <KeyboardAwareScrollView
        ref={ref}
        contentContainerStyle={contentContainerStyle}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        bottomOffset={bottomOffset}
        extraKeyboardSpace={extraKeyboardSpace}
        enabled={enabled}
        disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
        {...scrollViewProps}
      >
        {children}
      </KeyboardAwareScrollView>
    )
  }
)
