import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "../Icon"

export const ExclamationMarkCircleFill: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 19">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 16.5C12.866 16.5 16 13.366 16 9.5C16 5.63401 12.866 2.5 9 2.5C5.13401 2.5 2 5.63401 2 9.5C2 13.366 5.13401 16.5 9 16.5ZM9 5.75C9.41421 5.75 9.75 6.08579 9.75 6.5V9.5C9.75 9.91421 9.41421 10.25 9 10.25C8.58579 10.25 8.25 9.91421 8.25 9.5V6.5C8.25 6.08579 8.58579 5.75 9 5.75ZM8.25 12.5C8.25 12.0858 8.58579 11.75 9 11.75H9.00542C9.41963 11.75 9.75542 12.0858 9.75542 12.5C9.75542 12.9142 9.41963 13.25 9.00542 13.25H9C8.58579 13.25 8.25 12.9142 8.25 12.5Z"
        fill={color(props.fill || "black60")}
        fillRule="evenodd"
      />
    </Icon>
  )
}
