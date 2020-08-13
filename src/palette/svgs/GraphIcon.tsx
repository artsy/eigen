import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** GraphIcon */
export const GraphIcon: React.SFC<IconProps> = ({
  title = "View dashboard",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M4 10h1v5H4v-5zm3-2h1v7H7V8zm3-3h1v10h-1V5zm3-2h1v12h-1V3z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
