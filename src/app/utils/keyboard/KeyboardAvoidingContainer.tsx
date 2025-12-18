import { KeyboardAvoidingView, KeyboardAvoidingViewProps } from "react-native-keyboard-controller"

export const KeyboardAvoidingContainer: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  style,
  enabled = true,
  keyboardVerticalOffset = 0,
  // deconstrucing `contentContainerStyle` since it's not applicable when `behavior="padding"`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contentContainerStyle,
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
