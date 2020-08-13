import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** ArrowDownIcon */
export const ArrowDownIcon: React.SFC<IconProps> = ({
  title = "Reveal more",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M9 12.88L2.06 5.94l.88-.88L9 11.12l6.06-6.06.88.88z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
