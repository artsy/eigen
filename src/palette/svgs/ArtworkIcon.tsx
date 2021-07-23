import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** ArtworkIcon */
export const ArtworkIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M5.688 6l3.359-3.756L12.314 6H15v9H3V6h2.688zM7.03 6h3.958L9.036 3.756 7.03 6zM4 7v7h10V7H4zm2 2v3h6V9H6zM5 8h8v5H5V8z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
