import { useNavigationState } from "@react-navigation/native"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"

export function useSelectedTab(): BottomTabType {
  const routeName = useNavigationState((state) => state.routes[state.index].name)

  return routeName as BottomTabType
}
