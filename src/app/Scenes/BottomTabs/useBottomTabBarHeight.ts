import { useScreenDimensions } from "shared/hooks"
import { ICON_HEIGHT } from "./BottomTabsIcon"

const BOTTOM_TAB_SEPARATOR_HEIGHT = 1

export const useBottomTabBarHeight = () => {
  const { safeAreaInsets } = useScreenDimensions()

  return ICON_HEIGHT + safeAreaInsets.bottom + BOTTOM_TAB_SEPARATOR_HEIGHT
}
