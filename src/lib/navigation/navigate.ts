import { addBreadcrumb } from "@sentry/react-native"
import { AppModule, modules, ViewOptions } from "lib/AppRegistry"
import { __unsafe_switchTab, ARScreenPresenterModule } from "lib/NativeModules/ARScreenPresenterModule"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { GlobalStore, unsafe__getSelectedTab } from "lib/store/GlobalStore"
import { Linking } from "react-native"
import { matchRoute } from "./routes"

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: AppModule
  // Whether the new view should replace the previous (modal only)
  replace?: boolean
  props: object
}

let lastInvocation = { url: "", timestamp: 0 }

export async function navigate(url: string, options: { modal?: boolean; passProps?: object; replace?: boolean } = {}) {
  // Debounce double taps
  if (lastInvocation.url === url && Date.now() - lastInvocation.timestamp < 1000) {
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
  const { replace = false } = options

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

  if (presentModally) {
    ARScreenPresenterModule.presentModal(screenDescriptor)
  } else if (module.options.isRootViewForTabName) {
    // this view is one of our root tab views, e.g. home, search, etc.
    // switch to the tab, pop the stack, and scroll to the top.
    await ARScreenPresenterModule.popToRootAndScrollToTop(module.options.isRootViewForTabName)
    switchTab(module.options.isRootViewForTabName, result.params)
  } else {
    const selectedTab = unsafe__getSelectedTab()
    if (module.options.onlyShowInTabName) {
      GlobalStore.actions.bottomTabs.switchTab(module.options.onlyShowInTabName)
    }

    ARScreenPresenterModule.pushView(module.options.onlyShowInTabName ?? selectedTab, screenDescriptor)
  }
}

export function switchTab(tab: BottomTabType, props?: object) {
  if (props) {
    GlobalStore.actions.bottomTabs.setTabProps({ tab, props })
  }
  __unsafe_switchTab(tab)
}

export function dismissModal() {
  ARScreenPresenterModule.dismissModal()
}

export function goBack() {
  ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
  ARScreenPresenterModule.dismissModal()
}

export function popParentViewController() {
  ARScreenPresenterModule.popStack(unsafe__getSelectedTab())
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
