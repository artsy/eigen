import { useNavigationState } from "@react-navigation/native"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export function useSelectedTab(): BottomTabType {
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

  const routeName = useNavigationState((state) => state.routes[state.index].name)
  const tabState = useNavigationState(
    (state) => state.routes.find((r) => r.state?.type === "tab")?.state
  )

  if (enableNewNavigation) {
    return routeName as BottomTabType
  }

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
