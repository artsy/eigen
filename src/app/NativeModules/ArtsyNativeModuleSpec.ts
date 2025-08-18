import { TurboModuleRegistry } from "react-native"
import type { TurboModule } from "react-native"

export interface Spec extends TurboModule {
  readonly getConstants: () => {
    gitCommitShortHash: string
    isBetaOrDev: boolean
  }
  updateAuthState(token: string, expiryDateString: string, JSON: Object): void
  clearUserData(): Promise<void>
  getPushToken(): Promise<string | null>
}

export default TurboModuleRegistry.getEnforcing<Spec>("ArtsyNativeModule")
