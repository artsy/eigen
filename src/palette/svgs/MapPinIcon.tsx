import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** MapPinIcon */
export const MapPinIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9.395 16.807a.5.5 0 0 1-.79 0c-3.787-4.85-5.68-8.226-5.68-10.247 0-3.022 2.958-5.68 6.117-5.68 3.196 0 5.934 2.478 5.934 5.62 0 2.121-1.862 5.522-5.581 10.307zM13.975 6.5c0-2.566-2.268-4.62-4.933-4.62-2.63 0-5.118 2.236-5.118 4.68 0 1.65 1.692 4.726 5.075 9.123 3.32-4.34 4.977-7.433 4.977-9.183zM9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** LocationIcon */
export const LocationIcon = MapPinIcon
