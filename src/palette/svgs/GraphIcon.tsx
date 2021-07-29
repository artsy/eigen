import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** GraphIcon */
export const GraphIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M4 10h1v5H4v-5zm3-2h1v7H7V8zm3-3h1v10h-1V5zm3-2h1v12h-1V3z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
