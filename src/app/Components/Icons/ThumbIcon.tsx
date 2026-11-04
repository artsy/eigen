import { Color, useColor } from "@artsy/palette-mobile"
import Svg, { Path, SvgProps } from "react-native-svg"

// Not provided by @artsy/icons (as of 3.82.0); move there once design adds a thumbs pair
const THUMB_UP_FILLED =
  "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
const THUMB_UP_STROKE =
  "M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z"

interface ThumbIconProps extends SvgProps {
  direction: "up" | "down"
  filled?: boolean
  color?: Color
}

export const ThumbIcon = ({ direction, filled, color, style, ...props }: ThumbIconProps) => {
  const colorFn = useColor()

  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      style={[direction === "down" && { transform: [{ rotate: "180deg" }] }, style]}
      {...props}
    >
      <Path d={filled ? THUMB_UP_FILLED : THUMB_UP_STROKE} fill={colorFn(color || "mono100")} />
    </Svg>
  )
}
