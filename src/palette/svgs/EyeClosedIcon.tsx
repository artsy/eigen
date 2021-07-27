import { useColor } from "palette/hooks"
import React from "react"
import { G, Icon, IconProps, Path } from "./Icon"

/** EyeClosedIcon */
export const EyeClosedIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <G fill={color(props.fill)} fillRule="nonzero">
        <Path d="M2.249 8.605a.56.56 0 0 0 .016.6C4.172 12.044 6.406 13.43 9 13.43c2.594 0 4.828-1.387 6.736-4.225a.56.56 0 0 0 .017-.6c-1.714-2.901-3.944-4.318-6.742-4.318S3.975 5.703 2.25 8.605zM1.238 8.03C3.163 4.795 5.77 3.143 9.01 3.143c3.241 0 5.843 1.653 7.755 4.89.331.561.31 1.257-.053 1.798-2.109 3.139-4.69 4.74-7.713 4.74-3.021 0-5.602-1.6-7.711-4.738a1.681 1.681 0 0 1-.05-1.802z" />
        <Path d="M9 11.714A2.857 2.857 0 1 1 9 6a2.857 2.857 0 0 1 0 5.714zm0-1.143a1.714 1.714 0 1 0 0-3.428 1.714 1.714 0 0 0 0 3.428z" />
        <Path d="M15.054 2.053l.805.81-12.893 12.79-.805-.81z" />
      </G>
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** ClosedEyeIcon */
export const ClosedEyeIcon = EyeClosedIcon
