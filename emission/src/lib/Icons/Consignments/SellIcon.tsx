import React from "react"
import Svg, { Circle, G, Path } from "react-native-svg"

export const SellIcon = props => (
  <Svg width={40} height={40} {...props}>
    <G transform="translate(.162)" fill="#000" fillRule="evenodd">
      <Path
        d="M39.838 0H21.382L0 21.24l18.715 18.592 21.123-21.37V0zm-2 2v15.64L18.702 37 2.838 21.24 22.207 2h15.63z"
        fillRule="nonzero"
      />
      <Circle cx={30.213} cy={10.125} r={2} />
    </G>
  </Svg>
)
