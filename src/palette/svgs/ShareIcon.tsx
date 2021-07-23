import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const ShareIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M8.547 3.817L5.704 6.203a.25.25 0 0 1-.361-.042l-.3-.401a.25.25 0 0 1 .036-.338l3.579-3.123a.5.5 0 0 1 .672.013l.005.005.017.014 3.6 3.175a.25.25 0 0 1 .035.337l-.3.402a.25.25 0 0 1-.361.042L9.534 3.945V8H13.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5h4.047V3.817zm0 5.183H5v5h8V9H9.534v2.75a.25.25 0 0 1-.25.25h-.487a.25.25 0 0 1-.25-.25V9z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
