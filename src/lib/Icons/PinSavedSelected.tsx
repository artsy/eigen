import React from "react"
import Svg, { G, Path, SvgProps } from "react-native-svg"

interface PinProps extends SvgProps {
  pinWidth?: number
  pinHeight?: number
}

const PinSavedSelected = (props: PinProps) => (
  <Svg
    viewBox="0 0 54 54"
    width={props.pinWidth ? props.pinWidth : 45}
    height={props.pinHeight ? props.pinHeight : 45}
    {...props}
  >
    <Path
      d="M28.597 48.207a2.006 2.006 0 0 1-3.194 0C19.424 40.322 11 30.422 11 21c0-8.837 7.163-16 16-16s16 7.163 16 16c0 9.422-8.424 19.322-14.403 27.207zM21 21a6 6 0 1 0 12 0 6 6 0 0 0-12 0z"
      fill={"#6E1EFF"}
      fillRule="nonzero"
    />
    <G fillRule="nonzero" fill="none">
      <G transform="translate(11 5)" />
      <Path d="M20 21a7 7 0 1 1 14 0 7 7 0 0 1-14 0z" fill="#6E1EFF" />
      <Path stroke="#FFF" strokeWidth={1.75} d="M33.738 19.14l-7.218 9.392-4.63-5.305" />
    </G>
  </Svg>
)

export default PinSavedSelected
