import { EventEmitter } from "events"
import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { addBreadcrumb, captureMessage } from "@sentry/react-native"
import { AppModule, ViewOptions, modules } from "app/AppRegistry"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { NavigationRoutes } from "app/Navigation"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { matchRoute } from "app/routes"
import { GlobalStore, unsafe__getSelectedTab } from "app/store/GlobalStore"
import { propsStore } from "app/store/PropsStore"
import { postEventToProviders } from "app/utils/track/providers"
import { visualize } from "app/utils/visualizer"
import { useCallback } from "react"
import { InteractionManager, Linking, Platform } from "react-native"
import { saveDevNavigationStateSelectedTab } from "./useReloadedDevNavigationState"

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

export const useNavigate = () => {
  const navigation = useNavigation<NavigationProp<NavigationRoutes>>()

  const navigate = useCallback(
    async (url: string, options = {}) => {
      console.log("navigate", url, options)

      // TODO: leaking old nav into new nav for time being, remove this when we have a new nav
      const result = matchRoute(url)

      console.log("navigate result", result)
      // TODO : Mounir says we can use link builder thing to do this cleaner
      if (result.type === "match") {
        if (result.module === "Artist") {
          navigation.navigate("Artist", result.params as { artistID: string })
        } else if (result.module === "Partner") {
          navigation.navigate("Partner", result.params as { partnerID: string })
        } else if (result.module === "LocalDiscovery") {
          navigation.navigate("LocalDiscovery")
        } else if (result.module === "ArtistSeries") {
          navigation.navigate("ArtistSeries", result.params as { artistSeriesID: string })
        }
      }
    },
    [navigation]
  )

  return navigate
}

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
  // home handles this on its own since it is default tab
  if (tab !== "home") {
    postEventToProviders(tracks.tabScreenView(tab))
  }

  if (props) {
    GlobalStore.actions.bottomTabs.setTabProps({ tab, props })
  }
  GlobalStore.actions.bottomTabs.setSelectedTab(tab)
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

export function dismissModal(after?: () => void) {
  // We wait for interaction to finish before dismissing the modal, otherwise,
  // we might get a race condition that causes the UI to freeze
  InteractionManager.runAfterInteractions(() => {
    LegacyNativeModules.ARScreenPresenterModule.dismissModal()
    if (Platform.OS === "android") {
      navigationEvents.emit("modalDismissed")
    }

    after?.()
  })
}

export function goBack(backProps?: GoBackProps) {
  LegacyNativeModules.ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
  navigationEvents.emit("goBack", backProps)
}

export const useGoBack = () => {
  const navigation = useNavigation()

  const goBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return goBack
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

export function navigateToPartner(href: string) {
  navigate(href, {
    passProps: { entity: EntityType.Partner, slugType: SlugType.ProfileID },
  })
}

/**
 * Looks up the entity by slug passed in and presents appropriate viewController
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
