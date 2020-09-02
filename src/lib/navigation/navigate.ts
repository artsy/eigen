import { isNativeModule, modules } from "lib/AppRegistry"
import { Linking, NativeModules } from "react-native"
import { matchRoute } from "./routes"

export function navigate(url: string, options: { modal?: boolean } = {}) {
  const result = matchRoute(url)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  const module = modules[result.module]

  const presentModally = options.modal ?? (result.params as any).present_modally ?? module.presentModally ?? false

  if (isNativeModule(module)) {
    NativeModules.ARScreenPresenterModule.presentNativeScreen(result.module, result.params, presentModally)
  } else {
    NativeModules.ARScreenPresenterModule.presentReactScreen(result.module, result.params, presentModally, false)
  }
}

export function dismissModal() {
  NativeModules.ARScreenPresenterModule.dismissModal()
}

export function goBack() {
  NativeModules.ARScreenPresenterModule.goBack()
}
