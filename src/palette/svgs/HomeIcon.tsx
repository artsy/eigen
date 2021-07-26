import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const HomeIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M3.032 7.873H1.959A.65.65 0 0 1 1.575 6.7l7.423-5.437 7.534 5.434a.65.65 0 0 1-.38 1.177h-1.084v8.079H9.992v-5.023H7.967v5.023H3.032V7.873zm1 0v7.079h2.935V9.929h4.025v5.023h3.076V7.873H4.032zm11.036-1L9.002 2.498 3.03 6.873h12.04z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}
