import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** ArrowUpIcon */
export const ArrowUpIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M15.06 12.94L9 6.88l-6.06 6.06-.88-.88L9 5.12l6.94 6.94z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
