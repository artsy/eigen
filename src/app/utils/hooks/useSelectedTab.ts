import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"

export function useSelectedTab(): BottomTabType {
  const tabState = __unsafe_mainModalStackRef.current
    ?.getState()
    ?.routes.find((r) => r.state?.type === "tab")?.state

  if (!tabState) {
    return "home"
  } else {
    const { index, routes } = tabState
    if (index === undefined) {
      return "home"
    }
    return routes[index].name as BottomTabType
  }
}
