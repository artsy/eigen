import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** ArrowUpCircleIcon */
export const ArrowUpCircleIcon: React.SFC<IconProps> = ({
  title = "Reveal less",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M9 1.889A7.111 7.111 0 1 1 9 16.11 7.111 7.111 0 0 1 9 1.89zM9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm4.302 9.387L9 5.987 4.698 10.43l.79.782 3.556-3.555 3.512 3.51.746-.781z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
