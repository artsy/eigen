import { KeyboardAvoidingView, View } from "react-native"
import { KeyboardStickyView } from "react-native-keyboard-controller"

export interface BottomAlignedProps {
  onPress?: () => void
  buttonComponent: any
}

export const BottomAlignedButtonWrapper: React.FC<React.PropsWithChildren<BottomAlignedProps>> = (
  props
) => (
  <View style={{ flex: 1 }}>
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {props.children}
    </View>

    <KeyboardStickyView>{props.buttonComponent}</KeyboardStickyView>
  </View>
)
