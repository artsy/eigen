import { useColor, Color } from "@artsy/palette-mobile"
import Svg, { G, Path } from "react-native-svg"

interface ChevronIconProps {
  expanded?: boolean
  initialDirection?: string
  width?: number
  height?: number
  color?: Color
}

const ChevronIcon: React.FC<ChevronIconProps> = ({
  expanded,
  initialDirection,
  width = 14,
  height = 14,
  color: colorProp,
}) => {
  const color = useColor()
  let rotation
  if (expanded) {
    rotation = "rotate(-90, 25, 25)"
  } else if (initialDirection === "down") {
    rotation = "rotate(90, 25, 25)"
  } else {
    rotation = ""
  }

  return (
    <Svg style={{ top: 1 }} width={width} height={height} viewBox="0 0 54 54">
      <G transform={rotation}>
        <Path
          d="M18.192 7.92L32.498 27 18.192 46.08a1 1 0 0 0 .2 1.4l1.6 1.2a1 1 0 0 0 1.4-.2L36.597 28.2a2 2 0 0 0 0-2.4L21.392 5.52a1 1 0 0 0-1.4-.2l-1.6 1.2a1 1 0 0 0-.2 1.4z"
          fill={color(colorProp ?? "mono30")}
          fillRule="evenodd"
        />
      </G>
    </Svg>
  )
}

export default ChevronIcon
