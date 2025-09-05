import { KeyboardAvoidingView, View } from "react-native"

export interface BottomAlignedProps {
  onPress?: () => void
  buttonComponent: any
}

export const BottomAlignedButtonWrapper: React.FC<React.PropsWithChildren<BottomAlignedProps>> = (
  props
) => (
  <KeyboardAvoidingView style={{ flex: 1 }}>
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {props.children}
    </View>

    {props.buttonComponent}
  </KeyboardAvoidingView>
)
