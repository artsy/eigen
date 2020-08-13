import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** MagnifyingGlassIcon */
export const MagnifyingGlassIcon: React.SFC<IconProps> = ({
  title = "Search",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M11.5 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0-1A4.5 4.5 0 1 0 16 6.5 4.49 4.49 0 0 0 11.5 2zM9.442 9.525l-.88-.88L2.06 15.06l.88.88 6.502-6.415z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
