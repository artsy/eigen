import { useSpace } from "palette"
import { useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { AnimatableHeaderContext } from "./AnimatableHeaderContext"

export const AnimatableHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const space = useSpace()
  const largeTitleVerticalOffset = space("1")
  const [largeTitleHeight, setLargeTitleHeight] = useState(-1)
  const largeTitleEndEdge = largeTitleHeight - largeTitleVerticalOffset - 10
  const scrollOffsetY = useSharedValue(0)
  const [title, setTitle] = useState("")
  const [titleShown, setTitleShown] = useState(false)

  const headerHeight = space("6")

  const onScrollForAnimation = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetY.value = event.nativeEvent.contentOffset.y

    if (largeTitleHeight === -1) {
      setTitleShown(false)
    } else {
      if (scrollOffsetY.value >= largeTitleEndEdge) {
        setTitleShown(true)
      } else {
        setTitleShown(false)
      }
    }
  }

  return (
    <AnimatableHeaderContext.Provider
      value={{
        scrollOffsetY,
        onScrollForAnimation,
        headerHeight,
        largeTitleVerticalOffset,
        largeTitleHeight,
        setLargeTitleHeight,
        largeTitleEndEdge,
        title,
        setTitle,
        titleShown,
      }}
    >
      {children}
    </AnimatableHeaderContext.Provider>
  )
}
