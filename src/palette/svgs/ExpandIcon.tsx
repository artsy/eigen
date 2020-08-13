import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** ExpandIcon */
export const ExpandIcon: React.SFC<IconProps> = ({
  title = "Expand",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M15 3.708L10.76 7.96l-.708-.706L14.293 3H10V2h6v6h-1V3.708zM3 14.292l4.24-4.252.708.706L3.707 15H8v1H2v-6h1v4.292z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
