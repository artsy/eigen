import { ChevronIcon, Touchable } from "palette"
import React from "react"
import { View } from "react-native"
import { goBack } from "./navigate"

export const BackButton: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) {
    return null
  }

  return (
    <View style={{ position: "absolute", top: 80, left: 20, backgroundColor: "yellow" }}>
      <Touchable onPress={() => goBack()}>
        <ChevronIcon direction="left" />
      </Touchable>
    </View>
  )
}
