import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** CloseIcon */
export const CloseIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9.88 9l4.56 4.56-.88.88L9 9.88l-4.56 4.56-.88-.88L8.12 9 3.56 4.44l.88-.88L9 8.12l4.56-4.56.88.88z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
