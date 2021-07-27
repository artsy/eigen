import { useColor } from "palette/hooks"
import React from "react"
import { Circle, Icon, IconProps, Path } from "./Icon"

/** XCircleIcon */
export const XCircleIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Circle cx={9} cy={9} r={9} fill="white" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM12.3588 12.3587C12.0659 12.6516 11.591 12.6516 11.2981 12.3587L9 10.0607L6.70189 12.3588C6.409 12.6517 5.93413 12.6517 5.64123 12.3588C5.34834 12.0659 5.34834 11.591 5.64123 11.2981L7.93934 8.99999L5.64124 6.70189C5.34835 6.409 5.34835 5.93412 5.64124 5.64123C5.93413 5.34834 6.40901 5.34834 6.7019 5.64123L9 7.93933L11.2981 5.64125C11.591 5.34835 12.0659 5.34835 12.3587 5.64125C12.6516 5.93414 12.6516 6.40901 12.3587 6.70191L10.0607 8.99999L12.3588 11.2981C12.6516 11.591 12.6516 12.0659 12.3588 12.3587Z"
        fill={color(props.fill)}
      />
    </Icon>
  )
}
