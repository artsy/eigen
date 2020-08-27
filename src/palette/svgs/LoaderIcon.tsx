import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path } from "./Icon"

/** LoaderIcon */
export const LoaderIcon: React.FC<IconProps> = props => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path fill={color(props.fill)} d="M2 9.55v-1h14v1z" fillRule="nonzero" />
    </Icon>
  )
}
