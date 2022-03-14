import { Color, useColor } from "palette"
import React from "react"
import Svg, { Path } from "react-native-svg"

interface TrendingIconProps extends React.ComponentProps<typeof Svg> {
  width?: number
  height?: number
  color?: Color
}

export const TrendingIcon: React.FC<TrendingIconProps> = (props) => {
  const color = useColor()

  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 12.834A5.833 5.833 0 107 1.167a5.833 5.833 0 000 11.667zm3.346-7.39l-.312 1.988-.695-.588-1.945 1.65-.251.213-.252-.213-.95-.806-1.549 1.315-.503-.593L5.69 6.881l.252-.213.251.213.95.806 1.594-1.353-.732-.62 2.341-.27z"
        fill={color(props.color ?? "blue100")}
      />
    </Svg>
  )
}
