import React from "react"
import Svg, { Rect } from "react-native-svg"

export const ListViewIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={14} height={11} viewBox="0 0 14 11" {...props}>
    <Rect width="14" height="1" fill={props.fill || "black"} />
    <Rect y="5" width="14" height="1" fill={props.fill || "black"} />
    <Rect y="10" width="14" height="1" fill={props.fill || "black"} />
  </Svg>
)
