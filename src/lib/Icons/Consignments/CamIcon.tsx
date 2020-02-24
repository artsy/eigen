import React from "react"
import Svg, { Circle, G, Path } from "react-native-svg"

export const CamIcon = props => (
  <Svg width={40} height={35} viewBox="0 0 37 30" {...props}>
    <G fill="#000" fillRule="evenodd">
      <Path
        d="M32.625 0h-14.25v3.733H0V30h37V3.733h-4.375V0zm-2 2v3.733H35v22.266H2V5.733h18.375V2h10.25z"
        fillRule="nonzero"
      />
      <Path
        d="M18.375 10.333a6 6 0 110 12 6 6 0 010-12zm0 1.83a4.171 4.171 0 100 8.342 4.171 4.171 0 000-8.343z"
        fillRule="nonzero"
      />
      <Circle cx={7.375} cy={10.467} r={2} />
    </G>
  </Svg>
)
