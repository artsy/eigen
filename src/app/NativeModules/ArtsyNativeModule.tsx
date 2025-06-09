import { NativeModules, PixelRatio, Platform } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export const DEFAULT_NAVIGATION_BAR_COLOR = "#FFFFFF"

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
  setAppStyling:
    Platform.OS === "ios"
      ? () => {
          console.error("setAppStyling is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.setAppStyling,
  setNavigationBarColor:
    Platform.OS === "ios"
      ? () => {
          console.error("setNavigationBarColor is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.setNavigationBarColor,
  setAppLightContrast:
    Platform.OS === "ios"
      ? () => {
          console.error("setAppLightContrast is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.setAppLightContrast,
  get navigationBarHeight() {
    return Platform.OS === "ios"
      ? 0
      : NativeModules.ArtsyNativeModule.getConstants().navigationBarHeight / PixelRatio.get()
  },
  // We only lock screen orientation for phones. For tablets this has no impact
  lockActivityScreenOrientation:
    Platform.OS === "ios"
      ? () => {
          console.error("lockActivityScreenOrientation is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.lockActivityScreenOrientation,
  clearCache:
    Platform.OS === "ios"
      ? () => {
          console.error("clearCache is not needed on iOS. See HACKS.md.")
        }
      : NativeModules.ArtsyNativeModule.clearCache,
  gitCommitShortHash: NativeModules.ArtsyNativeModule.gitCommitShortHash,
  isBetaOrDev:
    Platform.OS === "ios"
      ? NativeModules.ArtsyNativeModule.isBetaOrDev
      : (NativeModules.ArtsyNativeModule.getConstants().isBeta as boolean) || __DEV__,
}
