import { init, setRelease } from "@sentry/react-native"
import Config from "react-native-config"
import { ArtsyNativeModules } from "./NativeModules/ArtsyNativeModules"
import { getCurrentEmissionState } from "./store/GlobalStore"

if (getCurrentEmissionState().sentryDSN) {
  // Important!: this needs to match the releaseVersion specified
  // in fastfile for sentry releases for sourcemaps to work correctly
  const appVersion = ArtsyNativeModules.ARTemporaryAPIModule.appVersion
  const buildVersion = ArtsyNativeModules.ARTemporaryAPIModule.buildVersion
  let sentryReleaseName = appVersion + "+" + buildVersion

  // Releases on sentry are org-wide so we need to distinguish
  // names in staging
  if (Config.SENTRY_STAGING_DSN === getCurrentEmissionState().sentryDSN) {
    sentryReleaseName = sentryReleaseName + "-dev"
  }

  init({
    dsn: getCurrentEmissionState().sentryDSN,
    release: sentryReleaseName,
  })
  setRelease(sentryReleaseName)
}
