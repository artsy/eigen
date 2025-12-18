import { KeyboardAvoidingView, KeyboardAvoidingViewProps } from "react-native-keyboard-controller"

type KeyboardAvoidingContainerProps = Omit<
  KeyboardAvoidingViewProps,
  "behaviour" | "contentContainerStyle"
>

export const KeyboardAvoidingContainer: React.FC<KeyboardAvoidingContainerProps> = ({
  children,
  style,
  enabled = true,
  keyboardVerticalOffset = 0,
  ...restProps
}) => {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior="padding"
      enabled={enabled}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...restProps}
    >
      {children}
    </KeyboardAvoidingView>
  )
}
