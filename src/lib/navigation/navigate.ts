import { AppModule, modules, ViewOptions } from "lib/AppRegistry"
import { GlobalStore, unsafe__getSelectedTab } from "lib/store/GlobalStore"
import { Linking, NativeModules } from "react-native"
import { matchRoute } from "./routes"
import { handleFairRouting } from "./util"

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: AppModule
  props: object
}

export async function navigate(url: string, options: { modal?: boolean; passProps?: object } = {}) {
  let result = matchRoute(url)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  // Conditional routing for fairs depends on the `:fairID` param,
  // so pulled that out into a separate method. Can be removed
  // when the old fair view is fully deprecated.
  // @ts-ignore
  if (result.type === "match" && !!result.params.fairID) {
    result = handleFairRouting(result)
  }

  const module = modules[result.module]

  const presentModally = options.modal ?? module.options.alwaysPresentModally ?? false

  const screenDescriptor: ViewDescriptor = {
    type: module.type,
    moduleName: result.module,
    props: {
      ...result.params,
      ...options.passProps,
    },
    ...module.options,
  }

  if (presentModally) {
    NativeModules.ARScreenPresenterModule.presentModal(screenDescriptor)
  } else if (module.options.isRootViewForTabName) {
    // this view is one of our root tab views, e.g. home, search, etc.
    // switch to the tab, pop the stack, and scroll to the top.
    await NativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(module.options.isRootViewForTabName)
    GlobalStore.actions.bottomTabs.setTabProps({ tab: module.options.isRootViewForTabName, props: result.params })
    GlobalStore.actions.bottomTabs.switchTab(module.options.isRootViewForTabName)
  } else {
    const selectedTab = unsafe__getSelectedTab()
    if (module.options.onlyShowInTabName) {
      GlobalStore.actions.bottomTabs.switchTab(module.options.onlyShowInTabName)
    }

    NativeModules.ARScreenPresenterModule.pushView(module.options.onlyShowInTabName ?? selectedTab, screenDescriptor)
  }
}

export function dismissModal() {
  NativeModules.ARScreenPresenterModule.dismissModal()
}

export function goBack() {
  NativeModules.ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
}

export function popParentViewController() {
  NativeModules.ARScreenPresenterModule.popStack(unsafe__getSelectedTab())
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
