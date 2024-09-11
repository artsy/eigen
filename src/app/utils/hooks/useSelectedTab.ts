import { useNavigationState } from "@react-navigation/native"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"

export function useSelectedTab(): BottomTabType {
  const tabState = useNavigationState(
    (state) => state.routes.find((r) => r.state?.type === "tab")?.state
  )

  const _unsafe_tabState = __unsafe_mainModalStackRef?.current
    ?.getState()
    ?.routes.find((r) => r.state?.type === "tab")?.state

  if (!tabState || !_unsafe_tabState) {
    return "home"
  } else {
    const { index, routes } = tabState || _unsafe_tabState
    if (index === undefined) {
      return "home"
    }
    return routes[index].name as BottomTabType
  }
}
