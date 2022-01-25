import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const AddIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M15 9.5H9.514V15H8.476V9.5H3V8.48h5.476V3h1.038v5.48H15z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
