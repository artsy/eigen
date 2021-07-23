import { useColor } from "palette/hooks"
import React from "react"
import { G, Icon, IconProps, Path } from "./Icon"

export const LogoutIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <G>
        <Path
          d="M7 2.813v1.062A5.502 5.502 0 0 0 9 14.5a5.5 5.5 0 0 0 2-10.625V2.813a6.5 6.5 0 1 1-4 0zM8.5 1h1v8.2h-1V1z"
          fill={color(props.fill)}
          fillRule="nonzero"
        />
      </G>
    </Icon>
  )
}
