import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** ArrowDownCircleIcon */
export const ArrowDownCircleIcon: React.SFC<IconProps> = ({
  title = "Reveal more",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M9 1.889A7.111 7.111 0 1 1 9 16.11 7.111 7.111 0 0 1 9 1.89zM9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm4.302 6.622l-.746-.79L9 10.431 5.489 6.875l-.791.782L9 12.102l4.302-4.48z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
