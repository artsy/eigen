import React from "react"

import { Image, ImageProps, View, ViewStyle } from "react-native"

const imageStyle: ViewStyle = {
  borderColor: "white",
  borderRadius: 40,
  width: 80,
  height: 20,
  borderWidth: 2,
  justifyContent: "center",
  alignItems: "center",
}

export const NavButton: React.FC<{ source: ImageProps["source"] }> = props => (
  <View style={imageStyle}>
    <Image source={props.source} />
  </View>
)
