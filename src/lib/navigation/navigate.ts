import { isNativeModule, modules } from "lib/AppRegistry"
import { Linking, NativeModules } from "react-native"
import { matchRoute } from "./routes"
import { handleFairRouting } from "./util"

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

  const presentModally = options.modal ?? module.alwaysPresentModally ?? false

  if (isNativeModule(module)) {
    NativeModules.ARScreenPresenterModule.presentNativeScreen(result.module, result.params, presentModally)
  } else {
    if (module.isRootViewForTabName && !presentModally) {
      NativeModules.ARScreenPresenterModule.switchTab(module.isRootViewForTabName, result.params, true)
    } else {
      if (module.onlyShowInTabName) {
        NativeModules.ARScreenPresenterModule.switchTab(module.onlyShowInTabName, {}, true)
      }
      NativeModules.ARScreenPresenterModule.presentReactScreen(
        result.module,
        result.params,
        presentModally,
        module.hidesBackButton ?? false
      )
    }
  }
}

export function dismissModal() {
  NativeModules.ARScreenPresenterModule.dismissModal()
}

export function goBack() {
  NativeModules.ARScreenPresenterModule.goBack()
}
