import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** EstablishedIcon */
export const EstablishedIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9 17.192A8.192 8.192 0 1 1 9 .808a8.192 8.192 0 0 1 0 16.384zm0-1A7.192 7.192 0 1 0 9 1.808a7.192 7.192 0 0 0 0 14.384zM6.952 7.06v3.268l2.096-1.264 2.01 1.25V7.06H6.952zm-1 5.039V6.06h6.106v6.053L9.04 10.236 5.952 12.1z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** TopEstablishedIcon */
export const TopEstablishedIcon = EstablishedIcon
