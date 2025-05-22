import { useColor, Color } from "@artsy/palette-mobile"
import Svg, { Path, SvgProps } from "react-native-svg"

interface GridViewIconProps extends SvgProps {
  color?: Color
}

export const GridViewIcon = (props: GridViewIconProps) => {
  const color = useColor()

  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" {...props}>
      <Path
        d="M3.682 11.048V3.682h7.37v7.366h-7.37zm0 9.27v-7.371h7.37v7.371h-7.37zm9.27-9.27V3.682h7.366v7.366h-7.366zm0 9.27v-7.371h7.366v7.371h-7.366zM5.08 9.648h4.573V5.082H5.08V9.65zm9.27 0h4.568V5.082H14.35V9.65zm0 9.271h4.568v-4.573H14.35v4.573zm-9.27 0h4.573v-4.573H5.08v4.573z"
        fill={color(props.color || "mono100")}
      />
    </Svg>
  )
}
