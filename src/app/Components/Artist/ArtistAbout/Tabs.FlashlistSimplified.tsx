import { useSpace } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { FlashListProps } from "@shopify/flash-list"
import { FlatListProps } from "react-native"
import { Tabs, useCurrentTabScrollY } from "react-native-collapsible-tab-view"

export function TabFlashListSimplified<T>(props: FlashListProps<T>) {
  // DISABLED: This hook was causing scroll conflicts between tabs
  // useListenForTabContentScroll()

  const space = useSpace()

  const contentContainerStyle = (props.contentContainerStyle ?? {}) as object

  // NOTE: Using Tabs.FlatList instead of Tabs.FlashList as a workaround for
  // scroll sync bugs with the new architecture. See:
  // https://github.com/PedroBern/react-native-collapsible-tab-view/issues/400
  return (
    <Tabs.FlatList
      contentContainerStyle={{
        paddingHorizontal: space(2),
        ...contentContainerStyle,
      }}
      {...(props as unknown as FlatListProps<T>)}
    />
  )
}

import { useAnimatedReaction, useSharedValue } from "react-native-reanimated"
import { useEffect } from "react"

export const useListenForTabContentScroll = () => {
  const { currentScrollYAnimated } = useScreenScrollContext()
  const currentTabScrollY = useCurrentTabScrollY()
  const logCounter = useSharedValue(0)

  useEffect(() => {
    console.log("[ScrollSync] About FlashList hook mounted", {
      hasScrollContext: !!currentScrollYAnimated,
      initialScrollY: currentTabScrollY.value,
      contextScrollY: currentScrollYAnimated?.value,
    })

    return () => {
      console.log("[ScrollSync] About FlashList hook unmounting", {
        finalScrollY: currentTabScrollY.value,
        contextScrollY: currentScrollYAnimated?.value,
      })
    }
  }, [])

  useAnimatedReaction(
    () => currentTabScrollY.value,
    // TODO: improve the conditions here
    (current, previous) => {
      const contextValue = currentScrollYAnimated?.value
      logCounter.value++

      // Only log every 10th event
      if (logCounter.value % 10 === 0) {
        console.log("[ScrollSync] About setting scroll:", {
          current,
          previous,
          contextBefore: contextValue,
          eventCount: logCounter.value,
        })
      }

      currentScrollYAnimated?.set(current)
    }
  )
}
