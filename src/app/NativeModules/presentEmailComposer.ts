import { stringify } from "qs"
import { Linking, Platform } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export function presentEmailComposer(toAddress: string, subject: string, body?: string) {
  if (Platform.OS !== "ios") {
    Linking.openURL(`mailto:${toAddress}?${stringify({ subject, body })}`)
  } else if (body) {
    LegacyNativeModules.ARTNativeScreenPresenterModule.presentEmailComposerWithBody(
      body,
      subject,
      toAddress
    )
  } else {
    LegacyNativeModules.ARTNativeScreenPresenterModule.presentEmailComposerWithSubject(
      subject,
      toAddress
    )
  }
}
