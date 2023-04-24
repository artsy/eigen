import { useNavigationState } from "@react-navigation/native"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"

export function useSelectedTab(): BottomTabType {
  const tabState = useNavigationState(
    (state) => state.routes.find((r) => r.state?.type === "tab")?.state
  )
  if (!tabState) {
    return "home"
  } else {
    const { index, routes } = tabState
    return routes[index!].name as BottomTabType
  }
}
