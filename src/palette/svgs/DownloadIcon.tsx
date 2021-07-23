import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** DownloadIcon */
export const DownloadIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M3 3h6.006l1.973 2.002H15v9.994H3V3zm.99 1v9.996h10.02V6.002h-3.465L8.601 4H3.99zm5.576 7.279l1.48-1.469.66.8L9 13.257l-2.739-2.875.711-.732 1.544 1.668-.046-.068V6.56l1.096.018v4.7z"
        fill={color(props.fill)}
        fillRule="evenodd"
      />
    </Icon>
  )
}
