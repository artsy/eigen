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
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 13,
        left: 10,
        backgroundColor: "white",
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
