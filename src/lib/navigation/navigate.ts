import { NativeModules } from "react-native"
import { matchRoute } from "./routes"

export function navigate(url: string) {
  const result = matchRoute(url)
  const modal = true
  NativeModules.ARScreenPresenterModule.presentReactScreen(result.module, result.params, modal, false)

  if (modal) {
    setTimeout(() => {
      NativeModules.ARScreenPresenterModule.dismissModal()
    }, 2000)
  }
}
