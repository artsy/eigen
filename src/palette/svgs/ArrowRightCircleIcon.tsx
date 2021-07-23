import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** ArrowRightCircleIcon */
export const ArrowRightCircleIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9 1.889A7.111 7.111 0 1 1 9 16.11 7.111 7.111 0 0 1 9 1.89zM9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm3.013 8l-4.4-4.302-.782.79 3.6 3.556-3.6 3.512.782.79L12.013 9z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
