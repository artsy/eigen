import { init } from "@sentry/react-native"
import { getCurrentEmissionState } from "./store/AppStore"

if (getCurrentEmissionState().sentryDSN) {
  init({
    dsn: getCurrentEmissionState().sentryDSN,
  })
}
