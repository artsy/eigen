import { findFocusedRoute } from "@react-navigation/native"
import * as Sentry from "@sentry/react-native"
import { TransactionContext } from "@sentry/types"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { BottomTabOption } from "app/Scenes/BottomTabs/BottomTabType"
import { appJson } from "app/utils/jsonFiles"
import { Platform } from "react-native"
import Config from "react-native-config"
import DeviceInfo from "react-native-device-info"

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation({
  enableTimeToInitialDisplay: true,
})

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const eigenSentryReleaseName = () => {
  const codePushReleaseName = appJson().codePushReleaseName
  if (codePushReleaseName && codePushReleaseName !== "none") {
    return codePushReleaseName
  } else {
    const prefix = Platform.OS === "ios" ? "ios" : "android"
    const buildNumber = DeviceInfo.getBuildNumber()
    const version = DeviceInfo.getVersion()
    return prefix + "-" + version + "-" + buildNumber
  }
}

const eigenSentryDist = () => {
  const codePushDist = appJson().codePushDist
  if (codePushDist && codePushDist !== "none") {
    return codePushDist
  } else {
    return DeviceInfo.getBuildNumber()
  }
}

interface SetupSentryProps extends Partial<Sentry.ReactNativeOptions> {
  debug?: boolean
}

export function setupSentry(props: SetupSentryProps = { debug: false }) {
  const sentryDSN = Config.SENTRY_DSN
  const ossUser = Config.OSS === "true"

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
    tracesSampleRate: props.debug ? 1.0 : 0.1,
    debug: props.debug,
    integrations: [
      new Sentry.ReactNativeTracing({
        enableUserInteractionTracing: true,
        routingInstrumentation,
        beforeNavigate: (context: TransactionContext) => {
          /**
           * This is a hack because our navigation setup is weird.
           * We have a main modal stack at the root and then every screen presented
           * in a tab gets its own stack. Sentry is registering every screen in a tab as
           * a screen transaction for the root screen. For example, tapping on an
           * artwork in the home screen will fire as `screen:home` instead of `screen:artwork`.
           * To fix it we find the focused route and update the context name to the correct screen name.
           * This should be updated if we change our navigation setup.
           */
          if (__unsafe_mainModalStackRef.current) {
            const mainNavState = __unsafe_mainModalStackRef.current?.getState()
            const focusedRoute = findFocusedRoute(mainNavState)
            const routeParams = focusedRoute?.params as { moduleName?: string }
            if (routeParams?.moduleName && !(routeParams?.moduleName in BottomTabOption)) {
              context.name = `screen:${routeParams.moduleName.toLowerCase()}`
            }
            context.sampled = true
          } else {
            // for now not sampling off main modal stack to avoid noise
            context.sampled = false
          }
          return context
        },
      }),
    ],
    ...props,
  })
}
