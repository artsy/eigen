import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** BlueChipIcon */
export const BlueChipIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 9 1a8 8 0 0 1 0 16zM6.879 8.842L9 10.964l2.121-2.122L9 6.721 6.879 8.842zM9 5.307l3.536 3.535L9 12.378 5.464 8.842 9 5.307z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
