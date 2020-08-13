import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** CheckCircleFillIcon */
export const CheckCircleFillIcon: React.SFC<IconProps> = ({
  title = "Uncheck",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M9 1a8 8 0 1 1 0 16A8 8 0 0 1 9 1zm4.32 5.796l-.764-.783-4.81 4.765-2.302-2.25-.782.783 3.085 3.067 5.573-5.582z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** CircleBlackCheckIcon */
export const CircleBlackCheckIcon = CheckCircleFillIcon
