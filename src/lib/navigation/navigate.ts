import { AppModule, modules, ViewOptions } from "lib/AppRegistry"
import { AppStore, unsafe__getSelectedTab } from "lib/store/AppStore"
import { Linking, NativeModules } from "react-native"
import { matchRoute } from "./routes"
import { handleFairRouting } from "./util"

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: AppModule
  props: object
}

export function navigate(url: string, options: { modal?: boolean } = {}) {
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
    props: result.params,
    ...module.options,
  }

  if (presentModally) {
    NativeModules.ARScreenPresenterModule.presentModal(screenDescriptor)
  } else {
    const selectedTab = unsafe__getSelectedTab()
    if (module.options.isRootViewForTabName) {
      if (selectedTab === module.options.isRootViewForTabName) {
        // TODO: this
        // NativeModules.ARScreenPresenterModule.popToRootOrScrollToTop(selectedTab)
      } else {
        AppStore.actions.bottomTabs.switchTab(module.options.isRootViewForTabName)
      }
    } else {
      if (module.options.onlyShowInTabName && selectedTab !== module.options.onlyShowInTabName) {
        AppStore.actions.bottomTabs.switchTab(module.options.onlyShowInTabName)
      }

      NativeModules.ARScreenPresenterModule.pushView(unsafe__getSelectedTab(), screenDescriptor)
    }
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
