import { useNavigationState, useRoute } from "@react-navigation/native"
import { ChevronIcon, Touchable } from "palette"
import React from "react"
import { Animated } from "react-native"
import { goBack } from "./navigate"

export const BackButton: React.FC = () => {
  const myKey = useRoute().key
  const isRoot = useNavigationState((state) => state.routes[0].key === myKey)
  if (isRoot) {
    return null
  }
  // const showing = useRef(new Animated.Value(visible ? 1 : 0)).current
  // useEffect(() => {
  //   Animated.timing(showing, {
  //     toValue: visible ? 1 : 0,
  //     useNativeDriver: true,
  //     delay: visible ? 120 : 0,
  //     easing: Easing.ease,
  //     duration: 100,
  //   }).start()
  // }, [visible])
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 13,
        left: 10,
        backgroundColor: "white",
        // opacity: showing,
        // transform: [{ translateX: showing.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Touchable onPress={() => goBack()}>
        <ChevronIcon direction="left" />
      </Touchable>
    </Animated.View>
  )
}
