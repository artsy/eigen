import * as Sentry from "@sentry/react-native"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"
import Keys from "react-native-keys"

export const navigationInstrumentation = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
})

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const eigenSentryReleaseName = () => {
  const prefix = Platform.OS === "ios" ? "ios" : "android"
  const buildNumber = DeviceInfo.getBuildNumber()
  const version = DeviceInfo.getVersion()
  return prefix + "-" + version + "-" + buildNumber
}

const eigenSentryDist = () => {
  return DeviceInfo.getBuildNumber()
}

interface SetupSentryProps extends Partial<Sentry.ReactNativeOptions> {
  debug?: boolean
}

export function setupSentry(props: SetupSentryProps = { debug: false }) {
  const sentryDSN = Keys.secureFor("SENTRY_DSN")
  const oss = Keys.OSS
  const ossUser = oss === "true"

  // In DEV, enabling this will clober stack traces in errors and logs, obscuring
  // the source of the error. So we disable it in dev mode.
  if (__DEV__ && !props.debug) {
    console.log("[dev] Sentry disabled in dev mode.")
    return
  }

  if (ossUser) {
    console.log("[oss] Sentry disabled in for oss user.")
    return
  }

  if (!sentryDSN) {
    console.error("Sentry DSN not set!!")
    return
  }

  Sentry.init({
    dsn: sentryDSN,
    release: eigenSentryReleaseName(),
    dist: eigenSentryDist(),
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
    enableWatchdogTerminationTracking: false,
    attachStacktrace: true,
    tracesSampleRate: props.debug ? 1.0 : 0.05,
    profilesSampleRate: props.debug ? 1.0 : 0.05,
    debug: props.debug,
    integrations: [navigationInstrumentation],
    ...props,
  })
}
