import React from "react"
import Svg, { Path } from "react-native-svg"

export const GridViewIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={14} height={14} viewBox="0 0 15 16" {...props}>
    <Path d="M0.599976 0.5H5.61398V5.95H0.599976V0.5Z" fill={props.fill || "black"} />
    <Path d="M0.599976 9.64761H5.61398V15.0976H0.599976V9.64761Z" fill={props.fill || "black"} />
    <Path d="M9.01619 0.5H14.0302V5.95H9.01619V0.5Z" fill={props.fill || "black"} />
    <Path d="M9.01619 9.64761H14.0302V15.0976H9.01619V9.64761Z" fill={props.fill || "black"} />
  </Svg>
)
