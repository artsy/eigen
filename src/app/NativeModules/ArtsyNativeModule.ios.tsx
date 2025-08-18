import { NativeModules } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export const DEFAULT_NAVIGATION_BAR_COLOR = "#FFFFFF"

/**
 * Cross-platform native module facade.
 * All new artsy-specific native bridge code should be exposed here.
 * Any legacy iOS native bridge code that is made cross-platform should also be exposed here.
 */

export const ArtsyNativeModule = {
  launchCount: LegacyNativeModules.ARNotificationsManager.getConstants().launchCount,
  setAppStyling: () => {
    console.error("setAppStyling is unsupported on iOS")
  },

  setNavigationBarColor: () => {
    console.error("setNavigationBarColor is unsupported on iOS")
  },
  setAppLightContrast: () => {
    console.error("setAppLightContrast is unsupported on iOS")
  },
  get navigationBarHeight() {
    return 0
  },
  // We only lock screen orientation for phones. For tablets this has no impact
  lockActivityScreenOrientation: () => {
    console.error("lockActivityScreenOrientation is unsupported on iOS")
  },
  clearCache: () => {
    console.error("clearCache is not needed on iOS. See HACKS.md.")
  },
  gitCommitShortHash: NativeModules.ArtsyNativeModule.gitCommitShortHash,
  isBetaOrDev: NativeModules.ArtsyNativeModule.isBetaOrDev,
}
