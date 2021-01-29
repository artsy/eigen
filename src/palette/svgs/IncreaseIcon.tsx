import React from "react"
import { color } from "../Theme"
import { Icon, IconProps, Path } from "./Icon"

export const IncreaseIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} viewBox="0 0 19 19">
      <Path
        d="M0 9.36131L1.76252 11.0949L8.24861 4.40328V19H10.7866V4.40328L17.2375 11.0949L19 9.36131L9.51763 0L0 9.36131Z"
        fill={color(props.fill)}
      />
    </Icon>
  )
}
