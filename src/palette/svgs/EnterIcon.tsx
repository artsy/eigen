import React from "react"
import { color } from "../helpers"
import { G, Icon, IconProps, Path, Title } from "./Icon"

/** EnterIcon */
export const EnterIcon: React.SFC<IconProps> = ({
  title = "Select",
  ...props
}) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <G>
        <Path
          d="M4.883 11.244l3.108 3.068-.693.688L3 10.758l4.299-4.23.692.689-3.106 3.056h9.134V3H15v8.244H4.883z"
          fill={color(props.fill)}
          fillRule="nonzero"
        />
      </G>
    </Icon>
  )
}
