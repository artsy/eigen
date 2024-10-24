import { EventEmitter } from "events"
import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { NavigationContainerRef, StackActions, TabActions } from "@react-navigation/native"
import { addBreadcrumb, captureMessage } from "@sentry/react-native"
import { AppModule, modules, ViewOptions } from "app/AppRegistry"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { matchRoute } from "app/routes"
import { GlobalStore, unsafe__getSelectedTab, unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { propsStore } from "app/store/PropsStore"
import { postEventToProviders } from "app/utils/track/providers"
import { visualize } from "app/utils/visualizer"
import { InteractionManager, Linking, Platform } from "react-native"

export const __unsafe_navigationRef = { current: null as NavigationContainerRef<any> | null }

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: AppModule
  // Whether the new view should replace the previous (modal only)
  replaceActiveModal?: boolean
  replaceActiveScreen?: boolean
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
  replaceActiveModal?: boolean
  replaceActiveScreen?: boolean
  // Only when onlyShowInTabName specified
  popToRootTabView?: boolean
  ignoreDebounce?: boolean
  showInTabName?: BottomTabType
}

let lastInvocation = { url: "", timestamp: 0 }

export async function navigate(url: string, options: NavigateOptions = {}) {
  let targetURL = url

  addBreadcrumb({
    message: `navigate to ${url}`,
    category: "navigation",
    data: { url, options },
    level: "info",
  })

  // handle artsy:// urls, we can just remove it
  targetURL = url.replace("artsy://", "")

  visualize("NAV", targetURL, { targetURL, options }, "DTShowNavigationVisualiser")

  // Debounce double taps
  const ignoreDebounce = options.ignoreDebounce ?? false
  if (
    lastInvocation.url === targetURL &&
    Date.now() - lastInvocation.timestamp < 1000 &&
    !ignoreDebounce
  ) {
    return
  }

  lastInvocation = { url: targetURL, timestamp: Date.now() }

  // marketing url requires redirect
  if (targetURL.startsWith("https://click.artsy.net")) {
    let response
    try {
      response = await fetch(targetURL)
    } catch (error) {
      if (__DEV__) {
        console.warn(error)
      } else {
        captureMessage(
          `[navigate] Error fetching marketing url redirect on: ${targetURL} failed with error: ${error}`,
          "error"
        )
      }
    }

    if (response?.url) {
      targetURL = response.url
    }
  }

  const result = matchRoute(targetURL)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  const module = modules[result.module]
  const presentModally = options.modal ?? module.options.alwaysPresentModally ?? false
  const {
    replaceActiveModal = false,
    replaceActiveScreen = false,
    popToRootTabView,
    showInTabName,
  } = options

  const screenDescriptor: ViewDescriptor = {
    type: module.type,
    moduleName: result.module,
    replaceActiveModal,
    replaceActiveScreen,
    props: {
      ...result.params,
      ...options.passProps,
    },
    ...module.options,
  }

  const useNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")

  if (useNewNavigation) {
    if (__unsafe_navigationRef.current?.isReady()) {
      __unsafe_navigationRef.current.dispatch(
        StackActions.push(result.module, { ...result.params, ...options.passProps })
      )
    }
    return
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
      const timeoutTime = __TEST__ ? 0 : 200
      setTimeout(() => {
        requestAnimationFrame(pushView)
      }, timeoutTime)
    } else {
      requestAnimationFrame(pushView)
    }
  }
}

export const navigationEvents = new EventEmitter()

export function switchTab(tab: BottomTabType, props?: object) {
  const enableNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")

  // root tabs are only mounted once so cannot be tracked
  // like other screens manually track screen views here
  // home handles this on its own since it is default tab
  if (tab !== "home") {
    postEventToProviders(tracks.tabScreenView(tab))
  }

  if (props) {
    GlobalStore.actions.bottomTabs.setTabProps({ tab, props })
  }

  GlobalStore.actions.bottomTabs.setSelectedTab(tab)

  if (enableNewNavigation) {
    __unsafe_navigationRef?.current?.dispatch(TabActions.jumpTo(tab, props))
    return
  } else {
    LegacyNativeModules.ARScreenPresenterModule.switchTab(tab)
  }
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

export function dismissModal(after?: () => void) {
  const enableNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")

  // We wait for interaction to finish before dismissing the modal, otherwise,
  // we might get a race condition that causes the UI to freeze
  InteractionManager.runAfterInteractions(() => {
    if (enableNewNavigation) {
      __unsafe_navigationRef?.current?.dispatch(StackActions.pop())
    } else {
      LegacyNativeModules.ARScreenPresenterModule.dismissModal()
    }
    if (Platform.OS === "android") {
      navigationEvents.emit("modalDismissed")
    }

    after?.()
  })
}

export function goBack(backProps?: GoBackProps) {
  const useNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")

  navigationEvents.emit("goBack", backProps)

  if (useNewNavigation) {
    if (__unsafe_navigationRef.current?.isReady()) {
      __unsafe_navigationRef.current.dispatch(StackActions.pop())
    }
    return
  }

  LegacyNativeModules.ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
}

export function popToRoot() {
  const enableNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")
  if (enableNewNavigation) {
    __unsafe_navigationRef?.current?.dispatch(StackActions.popToTop())
  } else {
    LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(unsafe__getSelectedTab())
  }
}

export enum EntityType {
  Partner = "partner",
  Fair = "fair",
}

export enum SlugType {
  ProfileID = "profileID",
  FairID = "fairID",
}

export function navigateToPartner(href: string) {
  navigate(href, {
    passProps: { entity: EntityType.Partner, slugType: SlugType.ProfileID },
  })
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
