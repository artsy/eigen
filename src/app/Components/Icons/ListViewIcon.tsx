import { useColor, Color } from "@artsy/palette-mobile"
import Svg, { Path, SvgProps } from "react-native-svg"

interface ListViewIconProps extends SvgProps {
  color?: Color
}

export const ListViewIcon = (props: ListViewIconProps) => {
  const color = useColor()

  return (
    <Svg width={14} height={14} viewBox="0 0 25 24" {...props}>
      <Path
        d="M4.946 16.746a.77.77 0 01-.792-.781c0-.222.074-.41.222-.562a.742.742 0 01.557-.23.775.775 0 01.794.782.772.772 0 01-.224.562.748.748 0 01-.557.23zm0-3.96a.77.77 0 01-.792-.78.78.78 0 01.222-.563.743.743 0 01.557-.23.775.775 0 01.794.783.772.772 0 01-.224.561.749.749 0 01-.557.23zm0-3.959a.77.77 0 01-.792-.782c0-.221.074-.408.222-.561a.742.742 0 01.557-.23.775.775 0 01.794.782.772.772 0 01-.224.562.748.748 0 01-.557.229zm2.993 7.822V15.25H21.35v1.4H7.94zm0-3.96V11.29H21.35v1.4H7.94zm0-3.939V7.351H21.35V8.75H7.94z"
        fill={color(props.color || "mono100")}
      />
    </Svg>
  )
}
