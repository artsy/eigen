import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** EnvelopeIcon */
export const EnvelopeIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M2.875 5.392v8.233h12.25v-8.08L9.002 11 2.875 5.392zm11.705-.517H3.588l5.423 4.963 5.57-4.963zm-12.566-.27L2 4.592l.021-.02a.75.75 0 0 1 .599-.56L2.632 4l.009.008A.756.756 0 0 1 2.75 4h12.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75H2.75a.75.75 0 0 1-.75-.75v-9c0-.05.005-.098.014-.145z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
