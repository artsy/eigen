import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const ReloadIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M17.71 10.89l-3.11 2.3-.43-3.84 1.14.5a6.09 6.09 0 0 0 .07-.85A6.36 6.36 0 0 0 5.19 3.9l-.75-1A7.53 7.53 0 0 1 9 1.38 7.63 7.63 0 0 1 16.62 9a7.74 7.74 0 0 1-.13 1.36l1.22.53zM9 15.38A6.38 6.38 0 0 1 2.62 9a6.09 6.09 0 0 1 .07-.85l1.14.5-.43-3.84-3.11 2.3 1.22.53A7.74 7.74 0 0 0 1.38 9 7.63 7.63 0 0 0 9 16.62a7.53 7.53 0 0 0 4.56-1.52l-.75-1A6.33 6.33 0 0 1 9 15.38z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
