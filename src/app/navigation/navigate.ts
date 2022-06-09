import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { addBreadcrumb } from "@sentry/react-native"
import { AppModule, modules, ViewOptions } from "app/AppRegistry"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { GlobalStore, unsafe__getSelectedTab } from "app/store/GlobalStore"
import { propsStore } from "app/store/PropsStore"
import { postEventToProviders } from "app/utils/track/providers"
import { visualize } from "app/utils/visualizer"
import { EventEmitter } from "events"
import { Linking, Platform } from "react-native"
import { matchRoute } from "./routes"
import { saveDevNavigationStateSelectedTab } from "./useReloadedDevNavigationState"

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: AppModule
  // Whether the new view should replace the previous (modal only)
  replace?: boolean
  props: object
}

export interface GoBackProps {
  previousScreen?: string
}

export interface NavigateOptions {
  modal?: boolean
  passProps?: {
    backProps?: GoBackProps
    [key: string]: any
  }
  replace?: boolean
  // Only when onlyShowInTabName specified
  popToRootTabView?: boolean
  ignoreDebounce?: boolean
  showInTabName?: BottomTabType
}

let lastInvocation = { url: "", timestamp: 0 }

export async function navigate(url: string, options: NavigateOptions = {}) {
  // handle artsy:// urls, we can just remove it
  url = url.replace("artsy://", "")

  visualize("NAV", url, { url, options }, "DTShowNavigationVisualiser")

  // Debounce double taps
  const ignoreDebounce = options.ignoreDebounce ?? false
  if (
    lastInvocation.url === url &&
    Date.now() - lastInvocation.timestamp < 1000 &&
    !ignoreDebounce
  ) {
    return
  }

  lastInvocation = { url, timestamp: Date.now() }

  const result = matchRoute(url)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  addBreadcrumb({
    message: `user navigated to ${url}`,
    category: "navigation",
  })

  const module = modules[result.module]
  const presentModally = options.modal ?? module.options.alwaysPresentModally ?? false
  const { replace = false, popToRootTabView, showInTabName } = options

  const screenDescriptor: ViewDescriptor = {
    type: module.type,
    moduleName: result.module,
    replace,
    props: {
      ...result.params,
      ...options.passProps,
    },
    ...module.options,
  }

  // Set props which we will reinject later. See HACKS.md
  propsStore.setPendingProps(screenDescriptor.moduleName, screenDescriptor.props)

  if (presentModally) {
    LegacyNativeModules.ARScreenPresenterModule.presentModal(screenDescriptor)
  } else if (module.options.isRootViewForTabName) {
    // this view is one of our root tab views, e.g. home, search, etc.
    // switch to the tab, pop the stack, and scroll to the top.
    await LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(
      module.options.isRootViewForTabName
    )
    switchTab(module.options.isRootViewForTabName, screenDescriptor.props)
  } else {
    const onlyShowInTabName = module.options.onlyShowInTabName || showInTabName
    const selectedTab = unsafe__getSelectedTab()

    // If we need to switch to a tab that is different from the selected one
    // we will need to delay the navigation action until we change tabs
    const waitForTabsToChange = !!onlyShowInTabName && onlyShowInTabName !== selectedTab
    const pushView = () => {
      LegacyNativeModules.ARScreenPresenterModule.pushView(
        onlyShowInTabName ?? selectedTab,
        screenDescriptor
      )
    }

    // If the screen should be on a tab, then switch to this tab first
    if (onlyShowInTabName) {
      if (popToRootTabView) {
        await LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(onlyShowInTabName)
      }

      switchTab(onlyShowInTabName)
    }

    if (waitForTabsToChange) {
      requestAnimationFrame(pushView)
    } else {
      pushView()
    }
  }
}

export const navigationEvents = new EventEmitter()

export function switchTab(tab: BottomTabType, props?: object) {
  // root tabs are only mounted once so cannot be tracked
  // like other screens manually track screen views here
  postEventToProviders(tracks.tabScreenView(tab))

  if (props) {
    GlobalStore.actions.bottomTabs.setTabProps({ tab, props })
  }
  LegacyNativeModules.ARScreenPresenterModule.switchTab(tab)
  saveDevNavigationStateSelectedTab(tab)
}

const tracks = {
  tabScreenView: (tab: BottomTabType): Screen => {
    let tabScreen = OwnerType.home
    switch (tab) {
      case "home":
        tabScreen = OwnerType.home
        break
      case "inbox":
        tabScreen = OwnerType.inbox
        break
      case "profile":
        tabScreen = OwnerType.profile
        break
      case "search":
        tabScreen = OwnerType.search
        break
      case "sell":
        tabScreen = OwnerType.sell
        break
    }

    return {
      context_screen_owner_type: tabScreen,
      action: ActionType.screen,
    }
  },
}

export function dismissModal() {
  LegacyNativeModules.ARScreenPresenterModule.dismissModal()
  if (Platform.OS === "android") {
    navigationEvents.emit("modalDismissed")
  }
}

export function goBack(backProps?: GoBackProps) {
  LegacyNativeModules.ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
  navigationEvents.emit("goBack", backProps)
}

export function popParentViewController() {
  LegacyNativeModules.ARScreenPresenterModule.popStack(unsafe__getSelectedTab())
}

export function popToRoot() {
  LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(unsafe__getSelectedTab())
}

export enum EntityType {
  Partner = "partner",
  Fair = "fair",
}

export enum SlugType {
  ProfileID = "profileID",
  FairID = "fairID",
}

export function navigateToPartner(slug: string) {
  navigate(slug, { passProps: { entity: EntityType.Partner, slugType: SlugType.ProfileID } })
}

/**
 * Looks up the entity by slug passed in and presents appropriate viewController
 * @param component: ignored, kept for compatibility
 * @param slug: identifier for the entity to be presented
 * @param entity: type of entity we are routing to, this is currently used to determine what loading
 * state to show, either 'fair' or 'partner'
 * @param slugType: type of slug or id being passed, this determines how the entity is looked up
 * in the api, if we have a fairID we can route directly to fair component and load the fair, if
 * we have a profileID we must first fetch the profile and find the ownerType which can be a fair
 * partner or other.
 */
export function navigateToEntity(slug: string, entity: EntityType, slugType: SlugType) {
  navigate(slug, { passProps: { entity, slugType } })
}
