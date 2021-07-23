import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "../Icon"

/** BookmarkFill */
export const BookmarkFill: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 21">
      <Path
        d="M5.94922 15.8745C6.2124 15.8745 6.36816 15.7241 6.85156 15.2568L8.95166 13.189C8.97852 13.1621 9.02686 13.1621 9.04834 13.189L11.1484 15.2568C11.6318 15.7241 11.7876 15.8745 12.0508 15.8745C12.4106 15.8745 12.6201 15.6382 12.6201 15.2192V5.89502C12.6201 4.87451 12.1099 4.35352 11.1001 4.35352H6.8999C5.89014 4.35352 5.37988 4.87451 5.37988 5.89502V15.2192C5.37988 15.6382 5.58936 15.8745 5.94922 15.8745Z"
        fill={color(props.fill || "black60")}
      />
    </Icon>
  )
}
