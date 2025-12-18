import { ScrollViewProps } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

interface KeyboardAwareFormProps extends ScrollViewProps {
  bottomOffset?: number
  extraKeyboardSpace?: number
  enabled?: boolean
  disableScrollOnKeyboardHide?: boolean
}

export const KeyboardAwareForm: React.FC<KeyboardAwareFormProps> = ({
  children,
  contentContainerStyle,
  bottomOffset = 20,
  extraKeyboardSpace,
  enabled = true,
  disableScrollOnKeyboardHide,
  ...scrollViewProps
}) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={contentContainerStyle}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
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
