import { useColor } from "palette/hooks"
import React from "react"
import { G, Icon, IconProps, Path } from "./Icon"

/** EyeOpenedIcon */
export const EyeOpenedIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <G fill={color(props.fill)} fillRule="nonzero">
        <Path d="M2.249 8.462a.56.56 0 0 0 .016.601C4.172 11.9 6.406 13.286 9 13.286c2.594 0 4.828-1.387 6.736-4.225a.56.56 0 0 0 .017-.6C14.038 5.56 11.808 4.144 9.01 4.144S3.975 5.56 2.25 8.463zm-1.011-.574C3.163 4.652 5.77 3 9.01 3c3.241 0 5.843 1.653 7.755 4.89.331.561.31 1.257-.053 1.798-2.109 3.139-4.69 4.74-7.713 4.74-3.021 0-5.602-1.6-7.711-4.738a1.681 1.681 0 0 1-.05-1.802z" />
        <Path d="M9 11.571a2.857 2.857 0 1 1 0-5.714 2.857 2.857 0 0 1 0 5.714zm0-1.142A1.714 1.714 0 1 0 9 7a1.714 1.714 0 0 0 0 3.429z" />
      </G>
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** OpenEyeIcon */
export const OpenEyeIcon = EyeOpenedIcon
