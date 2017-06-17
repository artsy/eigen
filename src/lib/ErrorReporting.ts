import { NativeModules } from "react-native"
const { Emission } = NativeModules

import { Sentry } from "react-native-sentry"

// AREmission sets this to "" if not configured, which is falsy in JS so this conditional is fine.
if (Emission.sentryDSN) {
  Sentry.config(Emission.sentryDSN).install()
}
