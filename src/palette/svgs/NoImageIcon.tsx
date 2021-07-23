import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const NoImageIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 12 18">
      <Path
        d="M2.62263891,12 L8.16110045,4 L1,4 L1,12 L2.62263891,12 Z M3.83889955,12 L11,12 L11,4 L9.37736109,4 L3.83889955,12 Z M8.85340814,3 L10.3735089,0.804298915 L11.1957011,1.37350889 L10.0696688,3 L12,3 L12,13 L3.14659186,13 L1.62649111,15.1957011 L0.804298915,14.6264911 L1.93033122,13 L0,13 L0,3 L8.85340814,3 Z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
      <Path
        d="M3,6 L3,10 L9,10 L9,6 L3,6 Z M2,5 L10,5 L10,11 L2,11 L2,5 Z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
