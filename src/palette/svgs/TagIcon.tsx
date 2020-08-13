import React from "react"
import { color } from "../helpers"
import { Circle, Icon, IconProps, Path, Title } from "./Icon"

/** TagIcon */
export const TagIcon: React.SFC<IconProps> = ({ title = "Page", ...props }) => {
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Title>{title}</Title>
      <Path
        d="M6.00044479,4.93806303 L6.00044479,15.4143978 L12.0004448,15.4143978 L12.0004448,4.92560152 L9.07178514,2.80969827 L6.00044479,4.93806303 Z M5.00044479,4.4143978 L9.08382677,1.58471261 L13.0004448,4.4143978 L13.0004448,16.4143978 L5.00044479,16.4143978 L5.00044479,4.4143978 Z"
        transform="translate(9.000445, 8.999555) rotate(-315.000000) translate(-9.000445, -8.999555)"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
      <Circle
        cx="11.5"
        cy="6.5"
        r="1"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
