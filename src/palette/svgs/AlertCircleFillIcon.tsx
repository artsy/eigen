import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const AlertCircleFillIcon: React.FC<IconProps> = ({
  title = "AlertCircleFillIcon",
  ...props
}) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9ZM8.42225 5.13333H9.5778L9.39114 10.7778H8.60892L8.42225 5.13333ZM8.42225 11.6578H9.56892V12.8667H8.44003L8.42225 11.6578Z"
        fill={color(props.fill)}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Icon>
  )
}
