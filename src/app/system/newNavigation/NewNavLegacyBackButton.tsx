import { CloseIcon, ChevronIcon } from "@artsy/palette-mobile"
import { useConditionalGoBack } from "app/system/newNavigation/useConditionalGoBack"
import { useScreenDimensions } from "app/utils/hooks"
import { useEffect, useRef } from "react"
import { Animated, TouchableOpacity, ViewStyle } from "react-native"
import { useFirstMountState } from "react-use/esm/useFirstMountState"

// TODO: Stolen with minor changes from BackButton in NavStack.tsx
// Do we need this? can we use palettes back button?
export const BackButton: React.FC<{
  show?: boolean
  showCloseIcon?: boolean
  style?: ViewStyle
  onPress?(): void
}> = ({ onPress, show = true, showCloseIcon = false, style }) => {
  const isFirstRender = useFirstMountState()
  const opacity = useRef(new Animated.Value(show ? 1 : 0)).current
  const goBack = useConditionalGoBack()

  useEffect(() => {
    if (!isFirstRender) {
      Animated.spring(opacity, {
        toValue: show ? 1 : 0,
        useNativeDriver: true,
      }).start()
    }
  }, [show])
  return (
    <Animated.View
      pointerEvents={show ? undefined : "none"}
      style={[
        {
          position: "absolute",
          top: 13 + useScreenDimensions().safeAreaInsets.top,
          left: 10,
          backgroundColor: "white",
          width: 40,
          height: 40,
          borderRadius: 20,
          opacity,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => (!!onPress ? onPress() : goBack())}
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
      >
        {showCloseIcon ? (
          <CloseIcon fill="black100" width={26} height={26} />
        ) : (
          <ChevronIcon direction="left" />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}
