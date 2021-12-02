import React, { useMemo } from "react"
import Animated from "react-native-reanimated"
import { CollapsableHeaderContext } from "./CollapsableHeaderContext"

export const CollapsableHeaderContextContainer: React.FC<{}> = (props) => {
  const { children } = props
  const value = useMemo(
    () => ({
      scrollOffsetY: new Animated.Value(0),
    }),
    []
  )

  return <CollapsableHeaderContext.Provider value={value}>{children}</CollapsableHeaderContext.Provider>
}
