import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** HeartIcon */
export const HeartIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M12 3a4 4 0 0 0-2.83 1.17L9 4.34l-.17-.17a4.002 4.002 0 0 0-5.66 5.66l5.48 5.47a.48.48 0 0 0 .7 0l5.48-5.47A4 4 0 0 0 12 3zm2.12 6.12L9 14.24 3.88 9.12a3 3 0 1 1 4.24-4.24l.53.52.35.36.35-.36.53-.52a3 3 0 0 1 4.24 4.24z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
