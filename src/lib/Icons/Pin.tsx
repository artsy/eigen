import React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */

export const Pin = props => (
  <Svg width={45} height={45} viewBox="0 0 54 54" {...props}>
    <Path
      d="M28.597 48.207a2.006 2.006 0 0 1-3.194 0C19.424 40.322 11 30.422 11 21c0-8.837 7.163-16 16-16s16 7.163 16 16c0 9.422-8.424 19.322-14.403 27.207zM21 21a6 6 0 1 0 12 0 6 6 0 0 0-12 0z"
      fill={props.selected ? "#6E1EFF" : "#000"}
      fillRule="nonzero"
    />
  </Svg>
)
