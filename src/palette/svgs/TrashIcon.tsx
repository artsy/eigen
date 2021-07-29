import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const TrashIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M15 4h-3V2.465a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V4H3v1h1l1 10.54a.5.5 0 0 0 .5.46h7a.5.5 0 0 0 .5-.46L14 5h1V4zM7 2.965h4V4H7V2.965zm5 12.075H6L5.05 5H13l-1 10.04z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
