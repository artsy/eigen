import React from "react"

import { Image, TouchableHighlight, TouchableHighlightProperties } from "react-native"

export default (props: TouchableHighlightProperties) =>
  <TouchableHighlight
    style={{
      height: 40,
      width: 40,
      position: "absolute",
      top: 20,
      right: 20,
      alignItems: "center",
      justifyContent: "center",
    }}
    {...props}
  >
    <Image source={require("../../../../../images/consignments/close-x.png")} />
  </TouchableHighlight>
