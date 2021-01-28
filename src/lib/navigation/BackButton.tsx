import { useNavigationState, useRoute } from "@react-navigation/native"
import { ChevronIcon } from "palette"
import React from "react"
import { Animated } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
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
      <TouchableOpacity
        onPress={() => {
          goBack()
        }}
      >
        <ChevronIcon direction="left" />
      </TouchableOpacity>
    </Animated.View>
  )
}
