// Inspired by useScrollToTop from react-navigation
// Original implementation: https://github.com/react-navigation/react-navigation/blob/main/packages/native/src/useScrollToTop.tsx

import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { useSelectedTab } from "app/store/GlobalStore"
import { RefObject, useEffect } from "react"

interface ScrollOptions {
  x?: number
  y?: number
  animated?: boolean
}

type ScrollableView =
  | { scrollToTop(): void }
  | { scrollTo(options: ScrollOptions): void }
  | { scrollToOffset(options: { offset?: number; animated?: boolean }): void }
  | { scrollResponderScrollTo(options: ScrollOptions): void }

type ScrollableWrapper =
  | { getScrollResponder(): React.ReactNode }
  | { getNode(): ScrollableView }
  | ScrollableView

function getScrollableNode(ref: React.RefObject<ScrollableWrapper>) {
  if (ref.current == null) {
    return null
  }

  // This is already a scrollable node.
  if (
    "scrollToTop" in ref.current ||
    "scrollTo" in ref.current ||
    "scrollToOffset" in ref.current ||
    "scrollResponderScrollTo" in ref.current
  ) {
    return ref.current
  }

  // If the view is a wrapper like FlatList, SectionList etc.
  // We need to use `getScrollResponder` to get access to the scroll responder
  if ("getScrollResponder" in ref.current) {
    return ref.current.getScrollResponder()
  }

  // When a `ScrollView` is wraped in `Animated.createAnimatedComponent`
  // we need to use `getNode` to get the ref to the actual scrollview.
  // Note that `getNode` is deprecated in newer versions of react-native
  // this is why we check if we already have a scrollable node above.
  if ("getNode" in ref.current) {
    return ref.current.getNode()
  }

  return ref.current
}

const scrollsByTab: Partial<Record<BottomTabType, React.RefObject<ScrollableWrapper> | null>> = {}

export const useScrollToTopByTab = (ref: RefObject<ScrollableWrapper>) => {
  const selectedTab = useSelectedTab()

  useEffect(() => {
    scrollsByTab[selectedTab] = ref
  }, [ref])
}

export const scrollToTopForTab = (tab: BottomTabType) => {
  const listRef = scrollsByTab[tab]

  if (!listRef) {
    console.warn(`listRef is not specified for "${tab}" tab`)
    return
  }

  // Run the operation in the next frame so we're sure all listeners have been run
  // This is necessary to know if preventDefault() has been called
  requestAnimationFrame(() => {
    const scrollable = getScrollableNode(listRef) as ScrollableWrapper

    if (!scrollable) {
      console.warn(`Unable to find scrollable for "${tab}" tab`)
      return
    }

    if ("scrollToTop" in scrollable) {
      scrollable.scrollToTop()
    } else if ("scrollTo" in scrollable) {
      scrollable.scrollTo({ y: 0, animated: true })
    } else if ("scrollToOffset" in scrollable) {
      scrollable.scrollToOffset({ offset: 0, animated: true })
    } else if ("scrollResponderScrollTo" in scrollable) {
      scrollable.scrollResponderScrollTo({ y: 0, animated: true })
    }
  })
}
