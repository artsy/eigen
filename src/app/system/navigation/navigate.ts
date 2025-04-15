import { EventEmitter } from "events"
import { CommonActions, StackActions, TabActions } from "@react-navigation/native"
import { tabsTracks } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { modules } from "app/Navigation/utils/modules"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { GlobalStore } from "app/store/GlobalStore"
import { getValidTargetURL } from "app/system/navigation/utils/getValidTargetURL"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
import { postEventToProviders } from "app/utils/track/providers"
import { visualize } from "app/utils/visualizer"
import { InteractionManager, Linking, Platform } from "react-native"

export interface GoBackProps {
  previousScreen?: string
}

export interface NavigateOptions {
  modal?: boolean
  passProps?: {
    backProps?: GoBackProps
    [key: string]: any
  }
  replaceActiveModal?: boolean
  replaceActiveScreen?: boolean
  // Only when onlyShowInTabName specified
  popToRootTabView?: boolean
  ignoreDebounce?: boolean
  showInTabName?: BottomTabType
}

let lastInvocation = { url: "", timestamp: 0 }

// Method used to quit early if the user pressed too many times in a row
function shouldQuit(options: NavigateOptions, targetURL: string): boolean {
  // Debounce double taps
  const ignoreDebounce = options.ignoreDebounce ?? false
  if (
    lastInvocation.url === targetURL &&
    Date.now() - lastInvocation.timestamp < 1000 &&
    !ignoreDebounce
  ) {
    return true
  }

  lastInvocation = { url: targetURL, timestamp: Date.now() }
  return false
}

export async function navigate(url: string, options: NavigateOptions = {}) {
  const targetURL = await getValidTargetURL(url)

  visualize("NAV", targetURL, { targetURL, options }, "DTShowNavigationVisualiser")

  const result = matchRoute(targetURL)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  const module = modules[result.module]

  if (shouldQuit(options, targetURL)) {
    return
  }

  if (!internal_navigationRef.current || !internal_navigationRef.current?.isReady()) {
    if (__DEV__) {
      throw new Error(
        `You are attempting to navigate before the navigation is ready.{\n}
           Make sure that the App NavigationContainer isReady is ready`
      )
    }
    return
  }

  const props = { ...result.params, ...options.passProps }

  if (options.replaceActiveModal || options.replaceActiveScreen) {
    internal_navigationRef.current.dispatch(StackActions.replace(result.module, props))
  } else {
    if (module.options?.onlyShowInTabName) {
      switchTab(module.options?.onlyShowInTabName, props)

      if (!module.options?.isRootViewForTabName) {
        // We wait for a frame to allow the tab to be switched before we navigate
        // This allows us to also override the back button behavior in the tab
        requestAnimationFrame(() => {
          internal_navigationRef.current?.dispatch(StackActions.push(result.module, props))
        })
      }
    } else {
      internal_navigationRef.current?.dispatch(StackActions.push(result.module, props))
    }

    const topTabName = module?.options?.topTabsNavigatorOptions?.topTabName
    if (topTabName) {
      // We need to wait for the material top tab navigator to finish mounting
      //  before we can navigate to it
      setTimeout(() => {
        internal_navigationRef.current?.dispatch(CommonActions.navigate(topTabName))
      }, 200)
    }
  }
}

export const navigationEvents = new EventEmitter()

export function switchTab(tab: BottomTabType, props?: object) {
  // root tabs are only mounted once so cannot be tracked
  // like other screens manually track screen views here
  // home handles this on its own since it is default tab
  if (tab !== "home") {
    postEventToProviders(tabsTracks.tabScreenView(tab))
  }

  if (props) {
    GlobalStore.actions.bottomTabs.setTabProps({ tab, props })
  }

  GlobalStore.actions.bottomTabs.setSelectedTab(tab)

  internal_navigationRef?.current?.dispatch(TabActions.jumpTo(tab, props))
}

export function dismissModal(after?: () => void) {
  // We wait for interaction to finish before dismissing the modal, otherwise,
  // we might get a race condition that causes the UI to freeze
  InteractionManager.runAfterInteractions(() => {
    internal_navigationRef?.current?.dispatch(StackActions.pop())

    if (Platform.OS === "android") {
      navigationEvents.emit("modalDismissed")
    }

    after?.()
  })
}

export function goBack(backProps?: GoBackProps) {
  navigationEvents.emit("goBack", backProps)

  if (internal_navigationRef.current?.isReady()) {
    internal_navigationRef.current.dispatch(StackActions.pop())
  }
}

export function popToRoot() {
  internal_navigationRef?.current?.dispatch(StackActions.popToTop())
}

export enum EntityType {
  Partner = "partner",
  Fair = "fair",
}

export enum SlugType {
  ProfileID = "profileID",
  FairID = "fairID",
}

export const PartnerNavigationProps = { entity: EntityType.Partner, slugType: SlugType.ProfileID }

export function navigateToPartner(href: string) {
  navigate(href, {
    passProps: PartnerNavigationProps,
  })
}
