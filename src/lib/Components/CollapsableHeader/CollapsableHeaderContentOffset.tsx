import React from "react"
import { ViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { useCollapsableHeaderContext } from "./CollapsableHeaderContext"

export const CollapsableContentOffset: React.FC<ViewProps> = (props) => {
  const { totalHeaderHeight } = useCollapsableHeaderContext()

  return <Animated.View style={{ height: totalHeaderHeight }} {...props} />
}
