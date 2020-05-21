import React from "react"

import { Image, ImageProps, View, ViewProps, ViewStyle } from "react-native"

const imageStyle: ViewStyle = {
  borderColor: "white",
  borderRadius: 40,
  width: 80,
  height: 80,
  borderWidth: 2,
  justifyContent: "center",
  alignItems: "center",
}

export const CircleImage: React.FC<{ source: ImageProps["source"]; style?: ViewProps["style"] }> = props => (
  <View style={[imageStyle, props.style]}>
    <Image source={props.source} />
  </View>
)
