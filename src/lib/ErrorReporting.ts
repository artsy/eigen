import * as Sentry from "@sentry/react-native"
import Config from "react-native-config"
import { LegacyNativeModules } from "./NativeModules/LegacyNativeModules"

if (Config.SENTRY_DSN) {
  // Important!: this needs to match the releaseVersion specified
  // in fastfile for sentry releases for sourcemaps to work correctly
  const appVersion = LegacyNativeModules.ARTemporaryAPIModule.appVersion
  const buildVersion = LegacyNativeModules.ARTemporaryAPIModule.buildVersion
  const sentryReleaseName = appVersion + "+" + buildVersion

  Sentry.init({
    dsn: Config.SENTRY_DSN,
    release: sentryReleaseName,
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
  })
}
