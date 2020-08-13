import React from "react"
import { color } from "../helpers"
import { G, Icon, IconProps, Path, Title } from "./Icon"

/** EditIcon */
export const EditIcon: React.SFC<IconProps> = ({
  title = "Edit",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <G fill={color(props.fill)} fillRule="evenodd">
        <Path d="M3 3h6.992v1.009H4.008V14H14V8h1v7H3z" />
        <Path
          d="M6.007 9.299l6.908-7.18L15.809 5l-7.07 6.989H6.006V9.299zm1 1.691h1.32l6.062-5.991-1.459-1.454-5.923 6.156v1.289z"
          fillRule="nonzero"
        />
      </G>
    </Icon>
  )
}
