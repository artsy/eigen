import { NativeModules } from "react-native"
const { Emission } = NativeModules

import { init } from "@sentry/react-native"

// AREmission sets this to "" if not configured, which is falsy in JS so this conditional is fine.
if (Emission.sentryDSN) {
  init({
    dsn: Emission.sentryDSN,
  })
}
