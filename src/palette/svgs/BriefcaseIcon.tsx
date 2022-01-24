import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** BriefcaseIcon */
export const BriefcaseIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M7.15 4.88a2.398 2.398 0 00-.094.214h3.888a2.398 2.398 0 00-.094-.214 1.805 1.805 0 00-.61-.71c-.278-.186-.671-.326-1.24-.326s-.962.14-1.24.326a1.805 1.805 0 00-.61.71zm4.594-.447c.115.229.194.456.25.66h3.131c.483 0 .875.393.875.876v8.312a.875.875 0 01-.875.875H2.875A.875.875 0 012 14.281V5.97c0-.484.392-.875.875-.875h3.131c.056-.205.135-.432.25-.661.194-.388.492-.79.95-1.095.46-.307 1.05-.494 1.794-.494s1.335.187 1.795.494c.457.305.755.707.95 1.095zM3 14.156v-3.75h5.5v.5h1v-.5H15v3.75H3zm6.5-4.75H15V6.094H3v3.312h5.5v-.5h1v.5z"
        fill={color(props.fill)}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Icon>
  )
}
