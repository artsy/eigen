import React from "react"
import Svg, { G, Path, SvgProps } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */

interface PinProps extends SvgProps {
  pinWidth?: number
  pinHeight?: number
}

const PinSavedOn = (props: PinProps) => (
  <Svg
    width={props.pinWidth ? props.pinWidth : 45}
    height={props.pinHeight ? props.pinHeight : 45}
    viewBox="0 0 54 54"
    {...props}
  >
    <G fillRule="nonzero" fill="none">
      <Path
        d="M9.899 23.567A1.14 1.14 0 0 1 9 24a1.14 1.14 0 0 1-.899-.433C4.74 19.267 0 13.867 0 8.727 0 3.907 4.03 0 9 0s9 3.907 9 8.727c0 5.14-4.739 10.54-8.101 14.84z"
        fill="#000"
      />
      <Path stroke="#FFF" strokeWidth={1.5} d="M12.343 7.54l-3.825 5.045L6 9.686" />
    </G>
  </Svg>
)

export default PinSavedOn
