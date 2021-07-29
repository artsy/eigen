import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** GenomeIcon */
export const GenomeIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M12 4H5.95v1H12V4zm0-1v-.988h.997V5.59c0 1.358-.728 2.665-2.364 3.421 1.632.769 2.364 2.09 2.364 3.51v1.69a.252.252 0 0 1 .003.039v.466a.252.252 0 0 1-.003.039v1.22H12v-1.01H5.95V16H5v-3.48c0-1.42.731-2.739 2.361-3.507C5.726 8.262 5 6.969 5 5.62V2h.95v1H12zm.002 3H5.957c.019.317.085.664.325.995.509.703 1.386 1.236 2.716 1.502 1.33-.266 2.206-.803 2.716-1.515.233-.326.281-.668.288-.982zM12 14v-1.01H5.95V14H12zm-.042-2.01c-.18-1.09-.967-2.063-2.96-2.475-1.993.412-2.815 1.385-3.004 2.475h5.964z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
