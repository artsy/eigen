import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { ChevronIcon } from "palette"
import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useFirstMountState } from "react-use/esm/useFirstMountState"
import { goBack } from "./navigate"

export const BackButton: React.FC<{ show?: boolean; onPress?(): void }> = ({ onPress = goBack, show = true }) => {
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
      style={{
        position: "absolute",
        top: 13 + useScreenDimensions().safeAreaInsets.top,
        left: 10,
        backgroundColor: "white",
        width: 40,
        height: 40,
        borderRadius: 20,
        opacity,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
      >
        <ChevronIcon direction="left" />
      </TouchableOpacity>
    </Animated.View>
  )
}
