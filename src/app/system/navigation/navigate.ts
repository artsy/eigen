import { EventEmitter } from "events"
import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { StackActions, TabActions } from "@react-navigation/native"
import { AppModule, modules, ViewOptions } from "app/AppRegistry"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { matchRoute } from "app/routes"
import { GlobalStore, unsafe__getSelectedTab, unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { propsStore } from "app/store/PropsStore"
import { getValidTargetURL } from "app/system/navigation/utils/getValidTargetURL"
import { postEventToProviders } from "app/utils/track/providers"
import { visualize } from "app/utils/visualizer"
import { InteractionManager, Linking, Platform } from "react-native"

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
  const enableNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")
  const targetURL = await getValidTargetURL(url)

  visualize("NAV", targetURL, { targetURL, options }, "DTShowNavigationVisualiser")

  const result = matchRoute(targetURL)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  const module = modules[result.module]

  const {
    replaceActiveModal = false,
    replaceActiveScreen = false,
    popToRootTabView,
    showInTabName,
  } = options

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
  if (enableNewNavigation) {
    if (!internal_navigationRef.current || !internal_navigationRef.current?.isReady()) {
      if (__DEV__) {
        throw new Error(
          `You are attempting to navigate before the navigation is ready.{\n}
           Make sure that the App NavigationContainer isReady is ready`
        )
      }
      return
    }

    if (replaceActiveModal || replaceActiveScreen) {
      internal_navigationRef.current.dispatch(
        StackActions.replace(result.module, { ...result.params, ...options.passProps })
      )
    } else {
      if (module.options.onlyShowInTabName) {
        switchTab(module.options.onlyShowInTabName)
        // We wait for a frame to allow the tab to be switched before we navigate
        // This allows us to also override the back button behavior in the tab
        requestAnimationFrame(() => {
          internal_navigationRef.current?.dispatch(
            StackActions.push(result.module, { ...result.params, ...options.passProps })
          )
        })
      } else {
        internal_navigationRef.current?.dispatch(
          StackActions.push(result.module, { ...result.params, ...options.passProps })
        )
      }
    }

    return
  }

  const presentModally = options.modal ?? module.options.alwaysPresentModally ?? false

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
    internal_navigationRef?.current?.dispatch(TabActions.jumpTo(tab, props))
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
      internal_navigationRef?.current?.dispatch(StackActions.pop())
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
  const enableNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")

  navigationEvents.emit("goBack", backProps)

  if (enableNewNavigation) {
    if (internal_navigationRef.current?.isReady()) {
      internal_navigationRef.current.dispatch(StackActions.pop())
    }
    return
  }

  LegacyNativeModules.ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
}

export function popToRoot() {
  const enableNewNavigation = unsafe_getFeatureFlag("AREnableNewNavigation")
  if (enableNewNavigation) {
    internal_navigationRef?.current?.dispatch(StackActions.popToTop())
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
