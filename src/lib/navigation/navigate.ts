import { isNativeModule, modules } from "lib/AppRegistry"
import { getCurrentEmissionState } from "lib/store/AppStore"
import { Linking, NativeModules } from "react-native"
import { matchRoute } from "./routes"

export function navigate(url: string, options: { modal?: boolean } = {}) {
  const result = matchRoute(url)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  if (result.params.fairID) {
    const showNewFairViewFeatureEnabled = getCurrentEmissionState().options.AROptionsShowNewFairScreen
    const fairSlugs = getCurrentEmissionState().legacyFairSlugs
    const useNewFairView = showNewFairViewFeatureEnabled && !fairSlugs?.includes(result.params.fairID)

    const fairModuleMapping = {
      FairArtworks: "Fair2",
      FairMoreInfo: "Fair2MoreInfo",
      FairArtists: "Fair2",
      FairExhibitors: "Fair2",
      FairBMWArtActivation: "Fair2MoreInfo",
    }

    if (useNewFairView) {
      console.log("RESULT.MODULE", result.module)
      const fairModule = fairModuleMapping[result.module]
      result.module = fairModule
    }
  }

  console.log("result", result)

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
