import { ArtsyNativeModules } from "lib/NativeModules/ArtsyNativeModules"
import { unsafe__getSelectedTab } from "lib/store/GlobalStore"
import { FlatListProps } from "react-native"

const SCROLL_UP_TO_SHOW_THRESHOLD = 150
const SCROLL_DOWN_TO_HIDE_THRESHOLD = 50

type Direction = "up" | "down" | null

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

export const hideBackButtonOnScroll: NonNullable<FlatListProps<any>["onScroll"]> = (ev) => {
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
    ArtsyNativeModules.ARScreenPresenterModule.updateShouldHideBackButton(false, unsafe__getSelectedTab())
    return
  }

  if (direction === "up" && offsetWhenDirectionChanged - yOffset > SCROLL_UP_TO_SHOW_THRESHOLD) {
    // then show the back button if the user has scrolled up far enough
    ArtsyNativeModules.ARScreenPresenterModule.updateShouldHideBackButton(false, unsafe__getSelectedTab())
    return
  } else if (direction === "down" && yOffset - offsetWhenDirectionChanged > SCROLL_DOWN_TO_HIDE_THRESHOLD) {
    // hide the back button if the user has scrolled down far enough
    ArtsyNativeModules.ARScreenPresenterModule.updateShouldHideBackButton(true, unsafe__getSelectedTab())
    return
  }
}
