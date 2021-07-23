import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

/** QuestionCircleIcon */
export const QuestionCircleIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M9 1.889A7.111 7.111 0 1 1 9 16.11 7.111 7.111 0 0 1 9 1.89zM9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm-.658 9.92v-.142c0-1.111.214-1.458 1.307-2.418.405-.294.66-.753.693-1.253a1.182 1.182 0 0 0-1.298-1.254 1.422 1.422 0 0 0-1.448 1.6H6.573a2.391 2.391 0 0 1 2.534-2.4 2.089 2.089 0 0 1 2.32 2c0 1.716-2.143 2.01-2.143 3.69v.177h-.942zm-.089 2.027V11.8H9.41v1.147H8.253z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** HelpIcon */
export const HelpIcon = QuestionCircleIcon
