import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { LegacyBackButtonContext } from "app/navigation/NavStack"
import { unsafe__getSelectedTab } from "app/store/GlobalStore"
import { useContext, useMemo } from "react"
import { FlatListProps, Platform } from "react-native"

export const SCROLL_UP_TO_SHOW_THRESHOLD = 150
const SCROLL_DOWN_TO_HIDE_THRESHOLD = 50

type Direction = "up" | "down" | null

export const createHideBackButtonOnScroll: (
  updateShouldHideBackButton: (shouldHide: boolean) => void
) => NonNullable<FlatListProps<any>["onScroll"]> = (updateShouldHideBackButton) => {
  let lastTarget = -1
  let lastDirection: Direction = null
  let offsetWhenDirectionChanged = 0
  let lastOffset = 0

  const reset = (target: number) => {
    lastTarget = target
    lastDirection = null
    offsetWhenDirectionChanged = 0
    lastOffset = 0
  }

  return (ev) => {
    if (ev.target !== lastTarget) {
      reset(ev.target)
    }

    const yOffset = ev.nativeEvent.contentOffset.y
    const direction: Direction = yOffset > lastOffset ? "down" : yOffset < lastOffset ? "up" : null
    lastOffset = yOffset

    if (direction !== lastDirection) {
      lastDirection = direction
      offsetWhenDirectionChanged = yOffset
      return
    }

    // first always show the back button when we're near the top of the scroll view
    if (yOffset < SCROLL_DOWN_TO_HIDE_THRESHOLD) {
      updateShouldHideBackButton(false)
      return
    }

    if (direction === "up" && offsetWhenDirectionChanged - yOffset > SCROLL_UP_TO_SHOW_THRESHOLD) {
      // then show the back button if the user has scrolled up far enough
      updateShouldHideBackButton(false)
      return
    } else if (
      direction === "down" &&
      yOffset - offsetWhenDirectionChanged > SCROLL_DOWN_TO_HIDE_THRESHOLD
    ) {
      // hide the back button if the user has scrolled down far enough
      updateShouldHideBackButton(true)
      return
    }
  }
}

export function useUpdateShouldHideBackButton() {
  if (Platform.OS === "ios") {
    return (shouldHide: boolean) =>
      LegacyNativeModules.ARScreenPresenterModule.updateShouldHideBackButton(
        shouldHide,
        unsafe__getSelectedTab()
      )
  } else {
    return useContext(LegacyBackButtonContext).updateShouldHideBackButton
  }
}

export function useHideBackButtonOnScroll() {
  const updateShouldHideBackButton = useUpdateShouldHideBackButton()
  return useMemo(() => createHideBackButtonOnScroll(updateShouldHideBackButton), [])
}
