import { Color, useColor } from "@artsy/palette-mobile"
import Svg, { Path, Rect } from "react-native-svg"

// TODO: Move to @artsy/icons, which has no microphone icon yet. Drawn on the same 18x18 grid and
// stroke weight as its stroke icons (e.g. CameraStrokeIcon) so the two sit together in a row.
interface MicrophoneIconProps {
  fill?: Color
  height?: number
  width?: number
}

export const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({
  fill = "mono100",
  height = 18,
  width = 18,
}) => {
  const color = useColor()
  const stroke = color(fill)

  return (
    <Svg fill="none" height={height} viewBox="0 0 18 18" width={width}>
      <Rect height={9} rx={2.75} stroke={stroke} strokeWidth={0.9} width={5.5} x={6.25} y={1.75} />
      <Path
        d="M3.75 8.5C3.75 11.4 6.1 13.75 9 13.75C11.9 13.75 14.25 11.4 14.25 8.5M9 13.75V16.25"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={0.9}
      />
    </Svg>
  )
}
