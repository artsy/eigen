import React from "react"
import { color } from "../helpers"
import { Icon, IconProps, Path } from "./Icon"

const FilledArrowCircle = ({ rotate, ...props }: IconProps & { rotate?: string }) => (
  <Icon {...props} style={rotate ? { transform: [{ rotate }] } : {}} viewBox="0 0 18 18">
    <Path
      d="M16 9.5C16 13.366 12.866 16.5 9 16.5C5.13401 16.5 2 13.366 2 9.5C2 5.63401 5.13401 2.5 9 2.5C12.866 2.5 16 5.63401 16 9.5Z M9 6.5002L6 11.7002L12 11.7002L9 6.5002Z"
      fill={color(props.fill)}
    />
  </Icon>
)

/** ArrowUpCircleFillIcon */
export const ArrowUpCircleFillIcon: React.SFC<IconProps> = props => {
  return <FilledArrowCircle {...props} />
}
/** ArrowDownCircleFillIcon */
export const ArrowDownCircleFillIcon: React.SFC<IconProps> = props => {
  return <FilledArrowCircle rotate="180deg" {...props} />
}
