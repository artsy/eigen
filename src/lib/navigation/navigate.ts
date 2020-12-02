// import { AppModule, modules, ViewOptions } from "lib/AppRegistry"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAppModule, safeModules, ViewOptions } from "lib/AppModules"
import { dismissModal as _dismissModal, presentModal as _presentModal, setGlobalVisible } from "lib/ModalStack"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { GlobalStore, unsafe__getSelectedTab } from "lib/store/GlobalStore"
import { Linking } from "react-native"
import { matchRoute } from "./routes"
import { handleFairRouting } from "./util"

let tabStackNavRefs: Record<BottomTabType, NavigationContainerRef | null> = {
  home: null,
  search: null,
  inbox: null,
  sell: null,
  profile: null,
}

export function setTabStackNavRefs(refs: typeof tabStackNavRefs) {
  tabStackNavRefs = refs
}

const infra = {
  presentModal(viewDescriptor: ViewDescriptor) {
    _presentModal(viewDescriptor)
  },
  popToRootAndScrollToTop(..._args: any[]) {
    console.error("no pop yet")
  },
  pushView(selectedTab: BottomTabType, viewDescriptor: ViewDescriptor) {
    tabStackNavRefs[selectedTab]?.navigate(viewDescriptor.moduleName, viewDescriptor.props)
  },
  popStack(selectedTab: BottomTabType) {
    tabStackNavRefs[selectedTab]?.goBack()
  },
  goBack(selectedTab: BottomTabType) {
    tabStackNavRefs[selectedTab]?.goBack()
  },
  dismissModal(..._args: any[]) {
    _dismissModal()
  },
}

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: SafeAppModule
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

  const module = safeModules[result.module as SafeAppModule]

  const presentModally = options.modal ?? module.options.alwaysPresentModally ?? false

  const screenDescriptor: ViewDescriptor = {
    type: module.type,
    moduleName: result.module as SafeAppModule,
    props: {
      ...result.params,
      ...options.passProps,
    },
    ...module.options,
  }

  if (presentModally) {
    infra.presentModal(screenDescriptor)
  } else if (module.options.isRootViewForTabName) {
    // this view is one of our root tab views, e.g. home, search, etc.
    // switch to the tab, pop the stack, and scroll to the top.
    await infra.popToRootAndScrollToTop(module.options.isRootViewForTabName)
    GlobalStore.actions.bottomTabs.setTabProps({ tab: module.options.isRootViewForTabName, props: result.params })
    GlobalStore.actions.bottomTabs.switchTab(module.options.isRootViewForTabName)
  } else {
    const selectedTab = unsafe__getSelectedTab()
    if (module.options.onlyShowInTabName) {
      GlobalStore.actions.bottomTabs.switchTab(module.options.onlyShowInTabName)
    }

    infra.pushView(module.options.onlyShowInTabName ?? selectedTab, screenDescriptor)
  }
}

export function dismissModal() {
  infra.dismissModal()
}

export function goBack() {
  infra.goBack(unsafe__getSelectedTab())
}

export function popParentViewController() {
  infra.popStack(unsafe__getSelectedTab())
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
