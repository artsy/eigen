import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "../Icon"

export const BoltFill: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 11 17">
      <Path
        d="M0.873047 9.82227H4.73535L2.69824 15.3594C2.43164 16.0635 3.16309 16.4395 3.62109 15.8652L9.83496 8.09961C9.95117 7.95605 10.0127 7.81934 10.0127 7.66211C10.0127 7.40234 9.80762 7.19727 9.52051 7.19727H5.6582L7.69531 1.66016C7.96191 0.956055 7.23047 0.580078 6.77246 1.16113L0.558594 8.91992C0.442383 9.07031 0.380859 9.20703 0.380859 9.35742C0.380859 9.62402 0.585938 9.82227 0.873047 9.82227Z"
        fill={color(props.fill || "black60")}
      />
    </Icon>
  )
}
