import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** CollapseIcon */
export const CollapseIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M7 11.708L2.76 15.96l-.708-.706L6.293 11H2v-1h6v6H7v-4.292zM11 6.292l4.24-4.252.708.706L11.707 7H16v1h-6V2h1v4.292z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
