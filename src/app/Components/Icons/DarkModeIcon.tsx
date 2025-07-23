import { useColor } from "@artsy/palette-mobile"
import Svg, { Path } from "react-native-svg"

// This icon is not provided by the design system
// TODO: Move to the design system once ready and signed off by design
export const DarkModeIcon = (props: React.ComponentProps<typeof Svg>) => {
  const color = useColor()
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" {...props}>
      <Path
        d="M9 1C11.1217 1 13.1569 1.84248 14.6572 3.34277C16.1575 4.84306 17 6.87827 17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1ZM9 1.88867C5.07265 1.88867 1.88869 5.07265 1.88867 9C1.88867 12.9274 5.07264 16.1113 9 16.1113V1.88867Z"
        fill={color("mono100")}
      />
    </Svg>
  )
}
