import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

/** CloseIcon */
export const CloseIcon: React.SFC<IconProps> = ({
  title = "Close",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M9.88 9l4.56 4.56-.88.88L9 9.88l-4.56 4.56-.88-.88L8.12 9 3.56 4.44l.88-.88L9 8.12l4.56-4.56.88.88z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
