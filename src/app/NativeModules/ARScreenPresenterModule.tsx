import {
  NavigationAction,
  NavigationContainerRef,
  NavigationState,
  StackActions,
  TabActions,
} from "@react-navigation/native"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { ViewDescriptor } from "app/system/navigation/navigate"
import { scrollTabToTop } from "app/utils/bottomTabsHelper"
import immer from "immer"
import { last } from "lodash"
import { NativeModules, StatusBar } from "react-native"
/**
 * Here we maintain references to all the navigators in the main app navigation hierarchy, which are:
 * - tab nav stacks
 *   i.e. what you see whe you switch to a particular tab
 * - the main modal stack
 *   i.e. the place where global modals are presented (excluding FancyModal)
 * - modal nav stacks
 *   i.e. the navigation stack _within_ a presented modal.
 *   These are unique in that they are created and destroyed, while all the others are only created once
 */

export const __unsafe_mainModalStackRef = { current: null as NavigationContainerRef<any> | null }

type Mutable<T> = T extends object
  ? {
      -readonly [P in keyof T]: Mutable<T[P]>
    }
  : T extends Array<infer E>
    ? Array<Mutable<E>>
    : T extends ReadonlyArray<infer E2>
      ? Array<Mutable<E2>>
      : T

function updateNavigationState(updater: (draft: Mutable<NavigationState>) => void) {
  const currentState = __unsafe_mainModalStackRef?.current?.getRootState()
  if (currentState) {
    const nextState = immer(currentState, updater)
    __unsafe_mainModalStackRef?.current?.resetRoot(nextState)
  }
}
function updateTabStackState(
  tab: BottomTabType,
  updater: (draft: Mutable<NavigationState>) => void
) {
  updateNavigationState((state) => {
    if (!state) {
      return
    }
    const tabs = state.routes[0].state?.routes
    const tabState = (
      tabs as Array<{ name: BottomTabType; state: Mutable<NavigationState> }>
    )?.find((x) => x.name === tab)?.state
    if (!tabState) {
      console.error("unable to find tab state for tab", tab, state)
      return
    }
    updater(tabState)
  })
}

// If the user is looking at a modal, return the nav stack ref for that modal, otherwise return null.
function getCurrentlyPresentedModalNavStackKey() {
  const mainModalStackRoutes = __unsafe_mainModalStackRef?.current?.getRootState()?.routes

  if (!mainModalStackRoutes || mainModalStackRoutes.length <= 1) {
    // the user is not looking at a modal.
    return null
  }

  const key = last(mainModalStackRoutes)?.key
  if (!key) {
    throw new Error("Couldn't get modal key")
  }

  return key
}

// When coming from a killed state our nav stack may not be
// set up yet, we check and wait for animations to finish
// to more reliably navigate
function dispatchNavAction(action: NavigationAction) {
  if (!__unsafe_mainModalStackRef?.current) {
    requestAnimationFrame(() => {
      __unsafe_mainModalStackRef?.current?.dispatch(action)
    })
  } else {
    __unsafe_mainModalStackRef?.current?.dispatch(action)
  }
}

export const ARScreenPresenterModule: (typeof NativeModules)["ARScreenPresenterModule"] = {
  switchTab(tab: BottomTabType) {
    dispatchNavAction(TabActions.jumpTo(tab))
  },
  presentModal(viewDescriptor: ViewDescriptor) {
    if (viewDescriptor.replaceActiveModal) {
      dispatchNavAction(
        StackActions.replace("modal", {
          rootModuleName: viewDescriptor.moduleName,
          rootModuleProps: viewDescriptor.props,
        })
      )
    } else {
      dispatchNavAction(
        StackActions.push("modal", {
          rootModuleName: viewDescriptor.moduleName,
          rootModuleProps: viewDescriptor.props,
        })
      )
    }
  },
  async popToRootAndScrollToTop(selectedTab: BottomTabType) {
    updateTabStackState(selectedTab, (state) => {
      state.routes = [state.routes[0]]
      state.index = 0
    })

    scrollTabToTop(selectedTab)
  },
  popToRootOrScrollToTop(selectedTab: BottomTabType) {
    updateTabStackState(selectedTab, (state) => {
      if (state.routes.length > 1) {
        state.routes = [state.routes[0]]
        state.index = 0
      } else {
        scrollTabToTop(selectedTab)
      }
    })
  },
  pushView(selectedTab: BottomTabType, viewDescriptor: ViewDescriptor) {
    const stackKey = getCurrentlyPresentedModalNavStackKey() ?? selectedTab
    if (viewDescriptor.replaceActiveScreen) {
      dispatchNavAction(
        StackActions.replace("screen:" + stackKey, {
          moduleName: viewDescriptor.moduleName,
          props: viewDescriptor.props,
        })
      )
    } else {
      dispatchNavAction(
        StackActions.push("screen:" + stackKey, {
          moduleName: viewDescriptor.moduleName,
          props: viewDescriptor.props,
        })
      )
    }
  },
  popStack(selectedTab: BottomTabType) {
    updateTabStackState(selectedTab, (state) => {
      state.routes.pop()
      state.index -= 1
    })
  },
  goBack(_selectedTab: BottomTabType) {
    __unsafe_mainModalStackRef?.current?.goBack()
  },
  dismissModal(..._args: any[]) {
    StatusBar.setBarStyle("dark-content", true)
    updateNavigationState((state) => {
      if (state.routes.length === 1) {
        return
      }
      state.routes.pop()
      state.index -= 1
    })
  },
  updateShouldHideBackButton: () => {
    console.warn("updateShouldHideBackButton not yet supported")
  },
}
