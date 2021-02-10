import { LegacyNativeModules } from "./LegacyNativeModules"

export function presentEmailComposer(toAddress: string, subject: string, body?: string) {
  if (body) {
    LegacyNativeModules.ARScreenPresenterModule.presentEmailComposerWithBody(body, subject, toAddress)
  } else {
    LegacyNativeModules.ARScreenPresenterModule.presentEmailComposerWithSubject(subject, toAddress)
  }
}
