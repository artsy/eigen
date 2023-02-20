import { useTheme, Color } from "@artsy/palette-mobile"
import { requireNativeComponent } from "react-native"

interface Props {
  /** The color of the dots (default: Artsy gray-medium) */
  color?: Color
}

export const DottedLine: React.FC<Props> = (props) => {
  const { color } = useTheme()

  return <NativeDottedLine style={{ height: 2 }} color={color(props.color ?? "black30")} />
}

const NativeDottedLine: React.ComponentClass<any> = requireNativeComponent("ARDottedLine")
