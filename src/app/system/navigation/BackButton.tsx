import { CloseIcon, ChevronIcon, useColor } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { useEffect, useRef } from "react"
import { Animated, TouchableOpacity, ViewStyle } from "react-native"
import { useFirstMountState } from "react-use/esm/useFirstMountState"
import { goBack } from "./navigate"

export const BackButton: React.FC<{
  show?: boolean
  showCloseIcon?: boolean
  style?: ViewStyle
  onPress?(): void
}> = ({ onPress = goBack, show = true, showCloseIcon = false, style }) => {
  const color = useColor()

  const isFirstRender = useFirstMountState()
  const opacity = useRef(new Animated.Value(show ? 1 : 0)).current
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
          backgroundColor: color("mono0"),
          width: 40,
          height: 40,
          borderRadius: 20,
          opacity,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress()}
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
      >
        {showCloseIcon ? (
          <CloseIcon fill="mono100" width={26} height={26} />
        ) : (
          <ChevronIcon direction="left" fill="mono100" />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}
