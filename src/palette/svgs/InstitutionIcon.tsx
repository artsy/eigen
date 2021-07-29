import { useColor } from "palette/hooks"
import React from "react"
import { G, Icon, IconProps, Path } from "./Icon"

/** InstitutionIcon */
export const InstitutionIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <G fill={color(props.fill)} fillRule="evenodd">
        <Path d="M4.381 6.686h1v7.378h-1z" />
        <Path d="M3 14h12v1H3z" />
        <Path d="M6.388 6.686h1v7.378h-1zM8.385 6.686h1v7.378h-1zM10.377 6.686h1v7.378h-1zM12.385 6.686h1v7.378h-1z" />
        <Path
          d="M8.986 3.24L5.12 6h7.548L8.986 3.24zM9 2l6.069 4.55a.25.25 0 0 1-.15.45H2.78a.25.25 0 0 1-.145-.453L9 2z"
          fillRule="nonzero"
        />
      </G>
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** MuseumIcon */
export const MuseumIcon = InstitutionIcon
