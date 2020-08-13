import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** LoaderIcon */
export const LoaderIcon: React.SFC<IconProps> = ({
  title = "Loading",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path fill={color(props.fill)} d="M2 9.55v-1h14v1z" fillRule="nonzero" />
    </Icon>
  )
}
