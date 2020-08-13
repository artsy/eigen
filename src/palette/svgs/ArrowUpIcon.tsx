import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** ArrowUpIcon */
export const ArrowUpIcon: React.SFC<IconProps> = ({
  title = "Reveal less",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M15.06 12.94L9 6.88l-6.06 6.06-.88-.88L9 5.12l6.94 6.94z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
