import { PixelRatio, TurboModuleRegistry } from "react-native"

export interface Spec {
  readonly getConstants: () => {
    launchCount: number
    navigationBarHeight: number
    gitCommitShortHash: string
    isBeta: boolean
  }
  setNavigationBarColor(color: string): void
  setAppStyling(): Promise<string>
  setAppLightContrast(isLight: boolean): Promise<string>
  setStatusBarColor(color: string): void
  lockActivityScreenOrientation(): void
  clearCache(): Promise<boolean>
}

const ArtsyNativeModuleSpec = TurboModuleRegistry.getEnforcing<Spec>("ArtsyNativeModule")

export const DEFAULT_NAVIGATION_BAR_COLOR = "#FFFFFF"

/**
 * Cross-platform native module facade.
 * All new artsy-specific native bridge code should be exposed here.
 * Any legacy iOS native bridge code that is made cross-platform should also be exposed here.
 */

export const ArtsyNativeModule = {
  launchCount: ArtsyNativeModuleSpec.getConstants().launchCount,
  setAppStyling: ArtsyNativeModuleSpec.setAppStyling,
  setNavigationBarColor: ArtsyNativeModuleSpec.setNavigationBarColor,
  setAppLightContrast: ArtsyNativeModuleSpec.setAppLightContrast,
  get navigationBarHeight() {
    return ArtsyNativeModuleSpec.getConstants().navigationBarHeight / PixelRatio.get()
  },
  // We only lock screen orientation for phones. For tablets this has no impact
  lockActivityScreenOrientation: ArtsyNativeModuleSpec.lockActivityScreenOrientation,
  clearCache: ArtsyNativeModuleSpec.clearCache,
  gitCommitShortHash: ArtsyNativeModuleSpec.getConstants().gitCommitShortHash,
  isBetaOrDev: ArtsyNativeModuleSpec.getConstants().isBeta || __DEV__,
}
