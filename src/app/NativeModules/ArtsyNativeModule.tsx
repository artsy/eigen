import { NativeModules, Platform } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

/**
 * Cross-platform native module facade.
 * All new artsy-specific native bridge code should be exposed here.
 * Any legacy iOS native bridge code that is made cross-platform should also be exposed here.
 */

export const ArtsyNativeModule = {
  launchCount:
    Platform.OS === "ios"
      ? LegacyNativeModules.ARNotificationsManager.getConstants().launchCount
      : (NativeModules.ArtsyNativeModule.getConstants().launchCount as number),
  gitCommitShortHash: NativeModules.ArtsyNativeModule.gitCommitShortHash,
  isBetaOrDev:
    Platform.OS === "ios"
      ? NativeModules.ArtsyNativeModule.isBetaOrDev
      : (NativeModules.ArtsyNativeModule.getConstants().isBeta as boolean) || __DEV__,
}
