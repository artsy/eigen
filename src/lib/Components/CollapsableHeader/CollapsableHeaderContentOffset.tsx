import { useTheme } from "palette"
import React from "react"
import { ViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { useCollapsableHeaderContext } from "./CollapsableHeaderContext"

export const CollapsableContentOffset: React.FC<ViewProps> = (props) => {
  const { space } = useTheme()
  const { stickyHeaderContentHeight } = useCollapsableHeaderContext()
  const headerContainerHeight = space(6)
  const totalStickyHeaderHeight = Animated.add(headerContainerHeight * 2, stickyHeaderContentHeight)

  return <Animated.View style={{ height: totalStickyHeaderHeight }} {...props} />
}
