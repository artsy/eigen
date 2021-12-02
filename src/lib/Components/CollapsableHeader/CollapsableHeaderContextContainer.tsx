import { useMeasuredView } from "lib/utils/useMeasuredView"
import React, { useEffect, useMemo, useState } from "react"
import Animated from "react-native-reanimated"
import { CollapsableHeaderContext } from "./CollapsableHeaderContext"

export const CollapsableHeaderContextContainer: React.FC<{}> = (props) => {
  const { children } = props
  const [jsx, setJSX] = useState<React.ReactNode>(null)
  const scrollOffsetY = useMemo(() => new Animated.Value(0), [])
  const { jsx: stickyHeaderContent, nativeHeight: stickyHeaderContentHeight } = useMeasuredView(jsx)

  useEffect(() => {
    console.log("[debug] stickyHeaderContent")
  }, [stickyHeaderContent])

  return (
    <CollapsableHeaderContext.Provider
      value={{
        scrollOffsetY,
        stickyHeaderContent,
        stickyHeaderContentHeight,
        setJSX,
      }}
    >
      {children}
    </CollapsableHeaderContext.Provider>
  )
}
