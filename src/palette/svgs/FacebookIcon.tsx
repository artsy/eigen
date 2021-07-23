import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const FacebookIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M15 3.66v10.68a.67.67 0 0 1-.66.66h-3.06v-4.64h1.56l.24-1.82h-1.8V7.39c0-.53.15-.89.9-.89h1V4.88a13.13 13.13 0 0 0-1.4-.07 2.19 2.19 0 0 0-2.33 2.4v1.33h-1.6v1.82h1.56V15H3.66a.66.66 0 0 1-.66-.66V3.66A.66.66 0 0 1 3.66 3h10.68a.66.66 0 0 1 .66.66z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
