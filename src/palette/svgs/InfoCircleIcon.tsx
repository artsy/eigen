import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** InfoCircleIcon */
export const InfoCircleIcon: React.SFC<IconProps> = ({
  title = "More info",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M9 1.889A7.111 7.111 0 1 1 9 16.11 7.111 7.111 0 0 1 9 1.89zM9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm-.489 4.133h.978V6.2H8.51V5.133zm.978 2.24v5.494H8.51V7.373h.978z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
