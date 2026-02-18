import { useSpace } from "@artsy/palette-mobile"
import { View } from "react-native"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface BottomAlignedProps {
  onPress?: () => void
  buttonComponent: any
}

export const BottomAlignedButtonWrapper: React.FC<React.PropsWithChildren<BottomAlignedProps>> = (
  props
) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()

  return (
    <View style={{ flex: 1 }}>
      <View key="space-eater" style={{ flexGrow: 1 }}>
        {props.children}
      </View>

      <KeyboardStickyView offset={{ opened: bottom - space(1) }}>
        {props.buttonComponent}
      </KeyboardStickyView>
    </View>
  )
}
