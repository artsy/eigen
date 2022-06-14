import { Color, useColor } from "palette"
import React from "react"
import Svg, { Rect } from "react-native-svg"

interface ListViewIconProps extends React.ComponentProps<typeof Svg> {
  color?: Color
}

export const ListViewIcon = (props: ListViewIconProps) => {
  const color = useColor()

  return (
    <Svg width={14} height={11} viewBox="0 0 14 11" {...props}>
      <Rect width="14" height="1" fill={color(props.color || "black100")} />
      <Rect y="5" width="14" height="1" fill={color(props.color || "black100")} />
      <Rect y="10" width="14" height="1" fill={color(props.color || "black100")} />
    </Svg>
  )
}
