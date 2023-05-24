import { useSpace } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useCurrentTabScrollY, useHeaderMeasurements } from "react-native-collapsible-tab-view"
import { useAnimatedStyle } from "react-native-reanimated"

/**
 * Use to position content directly below the tab bar, and for it to stick while
 * scrolling in the subview.
 *
 * Useful for views where subcontent has a s
 */
export const SubTabBar: React.FC = ({ children }) => {
  const { top } = useHeaderMeasurements()
  const scrollY = useCurrentTabScrollY()
  const space = useSpace()

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scrollY.value + top.value,
        },
      ],
    }
  }, [])

  return <MotiView style={[style, { zIndex: 1, marginHorizontal: -space(2) }]}>{children}</MotiView>
}
