import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const TwitterIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M6.26 15a8.63 8.63 0 0 1-4.64-1.35c.24.015.48.015.72 0a6.09 6.09 0 0 0 3.76-1.3 3 3 0 0 1-2.83-2.1c.188.032.379.048.57.05a3 3 0 0 0 .8-.11 3 3 0 0 1-2.43-3c.42.233.89.363 1.37.38a3 3 0 0 1-1.34-2.49 3 3 0 0 1 .4-1.52 8.6 8.6 0 0 0 6.24 3.16A3.84 3.84 0 0 1 8.81 6a3 3 0 0 1 5.24-2A6 6 0 0 0 16 3.22a3.06 3.06 0 0 1-1.36 1.68 6 6 0 0 0 1.74-.48A6.1 6.1 0 0 1 14.87 6v.39A8.56 8.56 0 0 1 6.26 15"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
