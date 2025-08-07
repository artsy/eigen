import { KeyboardAvoidingView, View } from "react-native"

export interface BottomAlignedProps {
  onPress?: () => void
  buttonComponent: any
  children?: React.ReactNode
}

export const BottomAlignedButtonWrapper: React.FC<BottomAlignedProps> = (props) => (
  <KeyboardAvoidingView style={{ flex: 1 }}>
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {props.children}
    </View>

    {props.buttonComponent}
  </KeyboardAvoidingView>
)
