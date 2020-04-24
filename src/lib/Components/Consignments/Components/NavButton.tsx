import React from "react"

import { Image, View, ViewStyle } from "react-native"

const imageStyle: ViewStyle = {
  borderColor: "white",
  borderRadius: 40,
  width: 80,
  height: 20,
  borderWidth: 2,
  justifyContent: "center",
  alignItems: "center",
}

export default (props: any /* STRICTNESS_MIGRATION */) => (
  <View style={imageStyle}>
    <Image source={props.source} />
  </View>
)
