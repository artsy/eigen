import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** CheckIcon */
export const CheckIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M6.936 12.206l7.64-7.63.848.849-8.492 8.48-4.248-4.282.852-.846z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
