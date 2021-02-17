import { Linking, Platform } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export function presentEmailComposer(toAddress: string, subject: string, body?: string) {
  if (Platform.OS !== "ios") {
    Linking.openURL(`mailto:${toAddress}?subject=${subject}${body ? "&body=" + body : ""}`)
  } else if (body) {
    LegacyNativeModules.ARScreenPresenterModule.presentEmailComposerWithBody(body, subject, toAddress)
  } else {
    LegacyNativeModules.ARScreenPresenterModule.presentEmailComposerWithSubject(subject, toAddress)
  }
}
