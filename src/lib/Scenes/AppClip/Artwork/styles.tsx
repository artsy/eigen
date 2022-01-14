import React from "react"
import { View } from "react-native"

export const textStyle = {
  fontSize: 16,
  fontFamily: "Unica77LL-Regular",
  marginBottom: 6,
}

export const textStyleGrey = {
  ...textStyle,
  color: "#777777",
}

export const textStyleBold = {
  ...textStyle,
  fontFamily: "Unica77LL-Medium",
}

export const textStyleBoldItalic = {
  ...textStyle,
  fontFamily: "Unica77LL-MediumItalic",
}

export const Separator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: "#f3f3f3",
      marginTop: 30,
      marginBottom: 30,
    }}
  />
)

export const viewStyleCTA = {
  backgroundColor: "#eee",
  borderTopWidth: 1,
  borderTopColor: "#ddd",
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
  padding: 20,
  marginLeft: -20,
  marginRight: -20,
}
