import { useIsFocused } from "@react-navigation/native"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { GlobalStore } from "app/store/GlobalStore"

export const useIsFocusedInTab = (tab: BottomTabType) => {
  const isFocused = useIsFocused()
  const activeTab = GlobalStore.useAppState((state) => state.bottomTabs.sessionState.selectedTab)

  return isFocused && activeTab === tab
}
