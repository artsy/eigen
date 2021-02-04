import { ChevronIcon } from "palette"
import React from "react"
import { Animated } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { goBack } from "./navigate"

export const BackButton: React.FC<{ onPress?(): void }> = ({ onPress = goBack }) => {
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
      <TouchableOpacity onPress={onPress}>
        <ChevronIcon direction="left" />
      </TouchableOpacity>
    </Animated.View>
  )
}
