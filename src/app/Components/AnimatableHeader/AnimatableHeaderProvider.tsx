import { useSpace } from "palette"
import React, { useMemo, useRef, useState } from "react"
import Animated from "react-native-reanimated"
import { AnimatableHeaderContext } from "./AnimatableHeaderContext"

export const AnimatableHeaderProvider: React.FC<{}> = (props) => {
  const { children } = props
  const space = useSpace()
  const headerHeight = space(6)
  const largeTitleVerticalOffset = space(1)
  const largeTitleHeight = useRef<Animated.Value<number>>(new Animated.Value(-1)).current
  const largeTitleEndEdge = Animated.sub(largeTitleHeight, largeTitleVerticalOffset + 10)
  const scrollOffsetY = useMemo(() => new Animated.Value(0), [])
  const [title, setTitle] = useState("")

  return (
    <AnimatableHeaderContext.Provider
      value={{
        scrollOffsetY,
        headerHeight,
        largeTitleVerticalOffset,
        largeTitleHeight,
        largeTitleEndEdge,
        title,
        setTitle,
      }}
    >
      {children}
    </AnimatableHeaderContext.Provider>
  )
}
