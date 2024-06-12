import { BOTTOM_TABS_HEIGHT } from "app/Scenes/BottomTabs/BottomTabs"
import { useScreenDimensions } from "app/utils/hooks"

const BOTTOM_TAB_SEPARATOR_HEIGHT = 1

export const useBottomTabBarHeight = () => {
  const { safeAreaInsets } = useScreenDimensions()

  return BOTTOM_TABS_HEIGHT + safeAreaInsets.bottom + BOTTOM_TAB_SEPARATOR_HEIGHT
}
