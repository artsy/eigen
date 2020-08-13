import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** PageIcon */
export const PageIcon: React.SFC<IconProps> = ({
  title = "Page",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M7,4.58398438 L3.5,4.58398438 L3.5,1 L1,1 L1,11 L7,11 L7,4.58398437 Z M6.09708454,3.58398437 L4.5,1.94556904 L4.5,3.58398438 L6.09708454,3.58398438 Z M0,0 L4,0 L8,4.10351563 L8,12 L0,12 L0,0 Z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
