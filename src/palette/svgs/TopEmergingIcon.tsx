import { useColor } from "palette/hooks"
import React from "react"
import { G, Icon, IconProps, Path } from "./Icon"

export const TopEmergingIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <G>
        <Path
          d="M9.036 16.071A7.036 7.036 0 1 0 9.036 2a7.036 7.036 0 0 0 0 14.071zm0 1A8.036 8.036 0 1 1 9.036 1a8.036 8.036 0 0 1 0 16.071z"
          fill={color(props.fill)}
          fillRule="nonzero"
        />
        <Path
          d="M9.542 7.9v4.15h-1V7.823L6.895 9.41 6.2 8.69l2.798-2.698 2.807 2.697-.693.722L9.542 7.9z"
          fill={color(props.fill)}
          fillRule="nonzero"
        />
      </G>
    </Icon>
  )
}
