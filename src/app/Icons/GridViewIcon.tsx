import { Color, useColor } from "palette"
import React from "react"
import Svg, { Path } from "react-native-svg"

interface GridViewIconProps extends React.ComponentProps<typeof Svg> {
  color?: Color
}

export const GridViewIcon = (props: GridViewIconProps) => {
  const color = useColor()

  return (
    <Svg width={14} height={14} viewBox="0 0 15 16" {...props}>
      <Path d="M0.599976 0.5H5.61398V5.95H0.599976V0.5Z" fill={color(props.color || "black100")} />
      <Path
        d="M0.599976 9.64761H5.61398V15.0976H0.599976V9.64761Z"
        fill={color(props.color || "black100")}
      />
      <Path d="M9.01619 0.5H14.0302V5.95H9.01619V0.5Z" fill={color(props.color || "black100")} />
      <Path
        d="M9.01619 9.64761H14.0302V15.0976H9.01619V9.64761Z"
        fill={color(props.color || "black100")}
      />
    </Svg>
  )
}
