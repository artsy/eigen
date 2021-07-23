import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** ArrowLeftCircleIcon */
export const ArrowLeftCircleIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9 1.889A7.111 7.111 0 1 1 9 16.11 7.111 7.111 0 0 1 9 1.89zM9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm2.169 11.556L7.569 9l3.6-3.511-.782-.791L5.987 9l4.444 4.302.738-.746z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
