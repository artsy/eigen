import { useColor } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { Animated } from "react-native"
import { useSpringFade } from "./useSpringFade"

// used to mask the image during initial transition in case the user has scrolled down some
// before tapping the image to open the full screen carousel. Without this there's a nasty
// jarring pop where the area of the image that was behind the status bar becomes fully visible.
export const StatusBarOverlay: React.FC = () => {
  const opacity = useSpringFade("out")
  const color = useColor()
  const { safeAreaInsets } = useScreenDimensions()
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        opacity,
        height: safeAreaInsets.top,
        backgroundColor: color("white100"),
      }}
    />
  )
}
