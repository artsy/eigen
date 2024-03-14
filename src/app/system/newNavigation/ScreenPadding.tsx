import { useScreenDimensions } from "@artsy/palette-mobile"
import { View } from "react-native"

export const ScreenPadding: React.FC<{
  fullBleed: boolean
  isPresentedModally: boolean
  isVisible: boolean
}> = ({ fullBleed, children }) => {
  const topInset = useScreenDimensions().safeAreaInsets.top
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: fullBleed ? 0 : topInset }}>
      {children}
    </View>
  )
}
