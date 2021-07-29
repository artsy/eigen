import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "../Icon"

/** ClockFill */
export const ClockFill: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 16 16">
      <Path
        d="M8 15.1826C12.0869 15.1826 15.4707 11.7915 15.4707 7.71191C15.4707 3.625 12.0796 0.241211 7.99268 0.241211C3.91309 0.241211 0.529297 3.625 0.529297 7.71191C0.529297 11.7915 3.92041 15.1826 8 15.1826ZM4.16943 8.50293C3.87646 8.50293 3.65674 8.2832 3.65674 7.99023C3.65674 7.70459 3.87646 7.48486 4.16943 7.48486H7.4873V3.05371C7.4873 2.76807 7.70703 2.54834 7.99268 2.54834C8.27832 2.54834 8.50537 2.76807 8.50537 3.05371V7.99023C8.50537 8.2832 8.27832 8.50293 7.99268 8.50293H4.16943Z"
        fill={color(props.fill || "black60")}
      />
    </Icon>
  )
}
