import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** InstagramIcon */
export const InstagramIcon: React.SFC<IconProps> = ({
  title = "Instagram",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M6.375 2.875a3.5 3.5 0 0 0-3.5 3.5v5.25a3.5 3.5 0 0 0 3.5 3.5h5.25a3.5 3.5 0 0 0 3.5-3.5v-5.25a3.5 3.5 0 0 0-3.5-3.5h-5.25zm0-.875h5.25A4.375 4.375 0 0 1 16 6.375v5.25A4.375 4.375 0 0 1 11.625 16h-5.25A4.375 4.375 0 0 1 2 11.625v-5.25A4.375 4.375 0 0 1 6.375 2zM9 6.375a2.625 2.625 0 1 0 0 5.25 2.625 2.625 0 0 0 0-5.25zM9 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm3.938.438a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
